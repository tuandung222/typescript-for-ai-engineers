---
title: 7.4 Hệ thống tool và MCP
---

# 7.4 Hệ thống tool và MCP

Tool system là phần phức tạp nhất của Gemini CLI core. Nó trả lời câu hỏi: khi model muốn đọc file, chạy shell command, hoặc gọi API bên ngoài, hệ thống làm gì? Bài này đọc kiến trúc tool từ lớp trừu tượng cao nhất đến triển khai cụ thể, bao gồm cả MCP plugin.

## Hai lớp: Tool definition và Tool invocation

Gemini CLI tách **định nghĩa tool** (tool là gì, schema ra sao) khỏi **lần gọi tool** (tool này với param này sẽ chạy thế nào). Đây là pattern Builder:

```typescript
// ToolBuilder (định nghĩa tool)  -  tools.ts
export interface ToolBuilder<TParams extends object, TResult extends ToolResult> {
  name: string;
  displayName: string;
  description: string;
  kind: Kind;
  getSchema(modelId?: string): FunctionDeclaration;
  isOutputMarkdown: boolean;
  canUpdateOutput: boolean;
  isReadOnly: boolean;
  build(params: TParams): ToolInvocation<TParams, TResult>;
}

// ToolInvocation (lần gọi cụ thể)  -  tools.ts
export interface ToolInvocation<TParams extends object, TResult extends ToolResult> {
  params: TParams;
  getDescription(): string;
  shouldConfirmExecute(abortSignal: AbortSignal, forcedDecision?: ForcedToolDecision):
    Promise<ToolCallConfirmationDetails | false>;
  execute(options: ExecuteOptions): Promise<TResult>;
  toolLocations(): ToolLocation[];
}
```

**`ToolBuilder`** là class-level: mỗi tool type (read-file, shell, grep, v.v.) có một builder. Builder chứa schema (JSON Schema cho params), description (để model biết tool làm gì), và method `build()` nhận raw params từ model, validate, rồi trả về `ToolInvocation`.

**`ToolInvocation`** là instance-level: mỗi lần model gọi tool, một invocation được tạo. Invocation biết params cụ thể, mô tả nó sẽ làm gì (`getDescription()`), check policy (`shouldConfirmExecute()`), và chạy (`execute()`).

## Base classes: DeclarativeTool và BaseToolInvocation

`tools.ts` (1141 dòng) cung cấp base class cho cả hai lớp:

```typescript
// Base class cho tool definition
export abstract class DeclarativeTool<TParams extends object, TResult extends ToolResult>
  implements ToolBuilder<TParams, TResult> {
  constructor(
    readonly name: string,
    readonly displayName: string,
    readonly description: string,
    readonly kind: Kind,
    readonly parameterSchema: unknown,
    readonly messageBus: MessageBus,
    readonly isOutputMarkdown: boolean = true,
    readonly canUpdateOutput: boolean = false,
  ) {}

  abstract build(params: TParams): ToolInvocation<TParams, TResult>;
}

// Base class cho tool invocation
export abstract class BaseToolInvocation<TParams extends object, TResult extends ToolResult>
  implements ToolInvocation<TParams, TResult> {
  constructor(
    readonly params: TParams,
    protected readonly messageBus: MessageBus,
    readonly _toolName?: string,
  ) {}

  abstract getDescription(): string;
  abstract execute(options: ExecuteOptions): Promise<TResult>;
}
```

`DeclarativeTool` là generic class. Mỗi tool cụ thể (ví dụ `ReadFileTool`) extends nó, định nghĩa schema cho params, và implement `build()` để tạo `ReadFileInvocation`. TypeScript generic đảm bảo type safety: `ReadFileTool.build()` nhận `ReadFileParams` và trả `ReadFileInvocation`  -  không có `any` hay `unknown` ở runtime.

### ForcedToolDecision: Policy flow

```typescript
export type ForcedToolDecision = 'allow' | 'deny' | 'ask_user';
```

Khi `shouldConfirmExecute()` được gọi, nó check policy engine trước. Policy trả về một trong ba decision:

- `'allow'` → tool chạy ngay, không hỏi user
- `'deny'` → throw error, tool không chạy
- `'ask_user'` → trả về `ToolCallConfirmationDetails` để UI hiển thị dialog cho user quyết định

## ToolRegistry: Trung tâm quản lý tool

File `tool-registry.ts` (809 dòng) triển khai `ToolRegistry`  -  registry chứa tất cả tool mà model có thể gọi:

```typescript
export class ToolRegistry {
  private allKnownTools: Map<string, AnyDeclarativeTool> = new Map();

  registerTool(tool: AnyDeclarativeTool): void {
    if (this.allKnownTools.has(tool.name)) {
      debugLogger.warn(`Tool "${tool.name}" already registered. Overwriting.`);
    }
    this.allKnownTools.set(tool.name, tool);
  }

  unregisterTool(name: string): void {
    this.allKnownTools.delete(name);
  }
}
```

### Built-in tools

Khi khởi tạo, registry đăng ký hơn 20 built-in tools:

- **File tools**: `read-file`, `read-many-files`, `write-file`, `edit`, `ls`, `glob`
- **Search tools**: `grep`, `ripGrep`
- **Shell**: `shell` (chạy command)
- **Web**: `web-search`, `web-fetch`
- **Memory**: `memoryTool` (GEMINI.md context)
- **Meta**: `write-todos`, `ask-user`, `activate-skill`

Mỗi tool là một file riêng trong `packages/core/src/tools/`. Ví dụ `read-file.ts`, `shell.ts`, `grep.ts`.

### Tool sorting và filtering

Registry sort tool theo priority:

```typescript
sortTools(): void {
  const getPriority = (tool: AnyDeclarativeTool): number => {
    if (tool instanceof DiscoveredMCPTool) return 2;  // MCP tools cuối
    if (tool instanceof DiscoveredTool) return 1;      // Discovered tools giữa
    return 0;                                           // Built-in tools đầu
  };
  // Sort by priority, MCP tools ordered by server name
}
```

`instanceof` check cho phép TypeScript phân biệt tool type ở runtime. Built-in tools luôn xuất hiện trước trong schema gửi cho model, MCP tools xuất hiện sau. Thứ tự này ảnh hưởng đến việc model ưu tiên gọi tool nào.

### Legacy aliases

```typescript
// tool-names.ts
export const TOOL_LEGACY_ALIASES: Record<string, string> = {
  'read_file': 'read-file',
  'write_file': 'write-file',
  // ...
};
```

Khi model gọi tool bằng tên cũ (underscore thay vì dash), registry resolve alias. Pattern này phổ biến khi API evolve nhưng cần backward compatibility.

## DiscoveredTool: Tool từ project

Ngoài built-in tools, Gemini CLI hỗ trợ discover tool từ project đang làm việc. Config định nghĩa discovery command và call command:

```typescript
export class DiscoveredTool extends BaseDeclarativeTool<ToolParams, ToolResult> {
  constructor(
    private readonly config: Config,
    originalName: string,
    prefixedName: string,
    description: string,
    parameterSchema: Record<string, unknown>,
    messageBus: MessageBus,
  ) {
    // Tool name có prefix để tránh conflict
    super(prefixedName, prefixedName, fullDescription, Kind.Other,
          parameterSchema, messageBus, false, false);
  }
}
```

Khi `discoverAllTools()` được gọi, registry chạy discovery command (subprocess), parse JSON output thành `FunctionDeclaration[]`, và tạo `DiscoveredTool` cho mỗi function. Khi model gọi discovered tool, `DiscoveredToolInvocation` chạy call command và pipe params qua stdin.

## MCP: Dynamic tool discovery

MCP (Model Context Protocol) là protocol chuẩn cho tool discovery. Gemini CLI dùng `@modelcontextprotocol/sdk` để kết nối MCP server:

```typescript
// mcp-client.ts  -  import từ MCP SDK
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
```

Ba transport được hỗ trợ:

- **Stdio**: MCP server chạy như subprocess, giao tiếp qua stdin/stdout
- **SSE (Server-Sent Events)**: MCP server là HTTP service, giao tiếp qua SSE
- **Streamable HTTP**: MCP server là HTTP service, giao tiếp qua HTTP streaming

### DiscoveredMCPTool

Khi kết nối MCP server thành công, mỗi tool từ server được wrap thành `DiscoveredMCPTool`:

```typescript
// mcp-tool.ts
export class DiscoveredMCPTool extends BaseDeclarativeTool<...> {
  readonly serverName: string;
  // Tool name = serverName + "__" + toolName để tránh conflict
}
```

MCP tool name có prefix với server name. Ví dụ server `github` có tool `create_issue` → tool name trong registry là `github__create_issue`. Prefix này giúp policy engine phân biệt tool từ các server khác nhau.

### MCP OAuth

MCP client hỗ trợ OAuth authentication:

```typescript
// mcp-client.ts
import { MCPOAuthProvider } from '../mcp/oauth-provider.js';
import { MCPOAuthTokenStorage } from '../mcp/oauth-token-storage.js';
import { OAuthUtils } from '../mcp/oauth-utils.js';
```

Khi MCP server yêu cầu authentication, Gemini CLI mở browser cho user login, nhận OAuth token, và lưu trữ để tái sử dụng. Đây là pattern phức tạp nhưng cần thiết cho production tool integration.

## Policy engine

Mỗi tool call đi qua policy engine trước khi execute. Policy được định nghĩa trong file TOML:

```typescript
// policy/types.ts
export enum ApprovalMode {
  DEFAULT = 'default',       // Hỏi user cho tool nguy hiểm
  AUTO_EDIT = 'auto_edit',  // Tự động cho edit tools
  YOLO = 'yolo',             // Tự động cho tất cả (dangerous!)
}

export enum PolicyDecision {
  ALLOW = 'allow',
  DENY = 'deny',
  ASK_USER = 'ask_user',
}
```

Policy rule ví dụ:

```toml
[tools.shell]
decision = "ask_user"

[tools.read-file]
decision = "allow"

[tools."github__create_issue"]
decision = "ask_user"
```

## Pattern cho AI engineer

Tool system của Gemini CLI dạy bạn 4 pattern thiết kế:

**1. Builder pattern cho tool**: Tách `build()` (validate params) khỏi `execute()` (chạy logic). Khi model hallucinate param sai, `build()` throw error trước khi `execute()` chạy. Đây là defense-in-depth.

**2. Registry pattern**: Một `Map<string, Tool>` đơn giản nhưng mạnh. Register, unregister, lookup, filter. Mọi tool  -  built-in, discovered, MCP  -  đều implement cùng interface. Polymorphism tại runtime.

**3. Discriminated decision**: `ForcedToolDecision = 'allow' | 'deny' | 'ask_user'`. Ba giá trị rõ ràng, exhaustively handled. Không có `null` hay `undefined` gây bug.

**4. Plugin qua protocol**: MCP là protocol, không phải API cụ thể. Bất kỳ MCP server nào cũng có thể thêm tool vào Gemini CLI mà không cần modify source. Đây là pattern bạn sẽ thấy trong mọi AI platform lớn (OpenAI, Anthropic, Google).

## Điều cần giữ lại

Tool system là phần code đáng đọc nhất trong Gemini CLI. Nó cho thấy cách TypeScript generic và discriminated union tạo nên type-safe plugin system. Builder + Registry + Policy là bộ ba pattern bạn sẽ lặp lại trong mọi AI agent. Khi xây tool system riêng, hãy bắt đầu từ interface `ToolInvocation`  -  nó định nghĩa contract mà mọi tool phải tuân theo.
