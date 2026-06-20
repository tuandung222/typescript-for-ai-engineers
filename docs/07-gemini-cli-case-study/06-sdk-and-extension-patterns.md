---
title: 7.6 SDK và mô hình mở rộng
---

# 7.6 SDK và mô hình mở rộng

Gemini CLI không chỉ là tool bạn chạy từ terminal. Nó còn là platform mà developer khác có thể nhúng vào ứng dụng, mở rộng bằng tool custom, và hook vào lifecycle. Bài này đọc SDK (`packages/sdk`), hooks system (`packages/core/src/hooks/`) và các pattern mở rộng khác.

## SDK: Public API cho programmatic usage

### Entry point

`packages/sdk/src/index.ts` (12 dòng) export 5 module:

```typescript
export * from './agent.js';
export * from './session.js';
export * from './tool.js';
export * from './skills.js';
export * from './types.js';
```

Đơn giản, rõ ràng. SDK chỉ expose 5 concept: Agent, Session, Tool, Skills, và Types. Mọi thứ khác là implementation detail.

### GeminiCliAgent: Entry point class

```typescript
// agent.ts (126 dòng)
export class GeminiCliAgent {
  constructor(options: GeminiCliAgentOptions) {
    this.options = options;
  }

  session(options?: { sessionId?: string }): GeminiCliSession {
    const sessionId = options?.sessionId || createSessionId();
    return new GeminiCliSession(this.options, sessionId, this);
  }

  async resumeSession(sessionId: string): Promise<GeminiCliSession> {
    // Tìm session trong storage, load conversation history
    // Trả về GeminiCliSession với resumed data
  }
}
```

Usage pattern:

```typescript
const agent = new GeminiCliAgent({
  instructions: 'You are a helpful coding assistant.',
  tools: [myTool],
  model: 'gemini-2.5-pro',
});

const session = agent.session();
await session.initialize();

for await (const event of session.sendStream('Hello!')) {
  console.log(event);
}
```

API design đẹp ở chỗ:
- **Builder-like constructor**: options object, tất cả optional trừ `instructions`
- **Session-based**: mỗi conversation là một session, có thể resume
- **AsyncIterable**: `sendStream()` trả về AsyncIterable, dùng với `for await...of`
- **Type-safe**: TypeScript infer event type từ discriminated union

### GeminiCliSession: Conversation lifecycle

```typescript
// session.ts (317 dòng)
export class GeminiCliSession {
  async initialize(): Promise<void> {
    // Tạo Config, register tools, setup client
  }

  async *sendStream(message: string): AsyncIterable<AgentEvent> {
    // Gửi message, yield từng event từ agent loop
  }

  async abort(): Promise<void> {
    // Cancel stream đang chạy
  }
}
```

Session wrap core agent loop cho SDK consumer. Nó tạo `Config` với minimal setup (hooks disabled, MCP disabled, policy default allow), register custom tools, và expose streaming API.

### SDK Tool: Zod-based definition

SDK dùng **Zod** cho tool schema  -  pattern phổ biến nhất trong TypeScript AI ecosystem:

```typescript
// tool.ts (236 dòng)
import { z } from 'zod';

export interface ToolDefinition<T extends z.ZodTypeAny> {
  name: string;
  description: string;
  inputSchema: T;
  sendErrorsToModel?: boolean;
}

export interface Tool<T extends z.ZodTypeAny> extends ToolDefinition<T> {
  action: (params: z.infer<T>, context?: SessionContext) => Promise<unknown>;
}
```

Usage:

```typescript
const weatherTool: Tool<z.ZodObject<{ city: z.ZodString }>> = {
  name: 'get_weather',
  description: 'Get current weather for a city',
  inputSchema: z.object({
    city: z.string().describe('City name'),
  }),
  action: async ({ city }) => {
    const data = await fetchWeather(city);
    return { temperature: data.temp, condition: data.condition };
  },
};
```

`z.infer<T>` là TypeScript utility type: nó extract TypeScript type từ Zod schema. Khi `action` nhận `params`, TypeScript biết `params.city` là `string`  -  compile-time safety từ runtime validation schema.

### ModelVisibleError: Error cho model

```typescript
export class ModelVisibleError extends Error {
  constructor(message: string | Error) {
    super(message instanceof Error ? message.message : message);
    this.name = 'ModelVisibleError';
  }
}
```

Khi tool throw `ModelVisibleError`, error message được trả về cho model thay vì crash app. Model có thể đọc error, hiểu vấn đề, và retry hoặc adjust approach. Đây là pattern quan trọng: **error không phải failure, error là feedback cho model**.

### SessionContext

SDK cung cấp context cho tool action:

```typescript
// types.ts
export interface SessionContext {
  filesystem: AgentFilesystem;  // Read/write files
  shell: AgentShell;            // Execute shell commands
  agent: GeminiCliAgent;
  session: GeminiCliSession;
}
```

Tool có thể đọc file, chạy command, và access session state. Context được inject bởi SDK, tool không cần biết implementation detail.

## Hooks system: Lifecycle customization

### 11 event types

File `hooks/types.ts` (749 dòng) định nghĩa hook event system:

```typescript
export enum HookEventName {
  BeforeTool = 'BeforeTool',
  AfterTool = 'AfterTool',
  BeforeAgent = 'BeforeAgent',
  AfterAgent = 'AfterAgent',
  BeforeModel = 'BeforeModel',
  AfterModel = 'AfterModel',
  BeforeToolSelection = 'BeforeToolSelection',
  Notification = 'Notification',
  SessionStart = 'SessionStart',
  SessionEnd = 'SessionEnd',
  PreCompress = 'PreCompress',
}
```

Mỗi event name tương ứng một thời điểm trong lifecycle:

- **BeforeTool / AfterTool**: trước và sau khi tool execute. Có thể modify params, block execution, hoặc modify result.
- **BeforeModel / AfterModel**: trước khi gửi request đến Gemini API và sau khi nhận response. Có thể modify request hoặc inject synthetic response.
- **BeforeToolSelection**: trước khi model chọn tool. Có thể modify tool config, restrict available tools.
- **BeforeAgent / AfterAgent**: toàn bộ agent turn.
- **SessionStart / SessionEnd**: session lifecycle.
- **PreCompress**: trước khi compress conversation history.

### Hook config: Command hoặc Runtime

```typescript
export enum HookType {
  Command = 'command',   // Chạy shell command
  Runtime = 'runtime',   // JavaScript function
}

export interface CommandHookConfig {
  type: HookType.Command;
  command: string;       // Shell command to execute
  timeout?: number;
  env?: Record<string, string>;
}

export interface RuntimeHookConfig {
  type: HookType.Runtime;
  name: string;
  action: HookAction;   // (input, { signal }) => Promise<HookOutput | void>
  timeout?: number;
}

export type HookConfig = CommandHookConfig | RuntimeHookConfig;
```

**Command hook**: khi event fire, chạy shell command. Command nhận context qua stdin (JSON), trả kết quả qua stdout. Phù hợp cho integration với tool bên ngoài (linter, security scanner).

**Runtime hook**: JavaScript/TypeScript function chạy trong process. Nhanh hơn command hook, access trực tiếp vào data. Phù hợp cho custom logic phức tạp.

### Hook output: Quyết định flow

```typescript
export interface HookOutput {
  continue?: boolean;      // false = stop execution
  stopReason?: string;
  suppressOutput?: boolean;
  systemMessage?: string;
  decision?: HookDecision;    // 'approve' | 'deny' | 'block' | 'ask'
  reason?: string;
  hookSpecificOutput?: Record<string, unknown>;
}
```

Hook output control flow:

- `continue: false` → dừng agent loop
- `decision: 'deny'` → block tool execution
- `decision: 'approve'` → force allow (bypass policy)
- `systemMessage` → inject system message vào conversation
- `suppressOutput` → ẩn output khỏi user

### Hook output classes

Mỗi event type có output class riêng với method specific:

```typescript
export class DefaultHookOutput implements HookOutput {
  isBlockingDecision(): boolean;
  shouldStopExecution(): boolean;
  getEffectiveReason(): string;
  getAdditionalContext(): string | undefined;
}

export class BeforeToolHookOutput extends DefaultHookOutput {
  getModifiedToolInput(): Record<string, unknown> | undefined;
}

export class BeforeModelHookOutput extends DefaultHookOutput {
  getSyntheticResponse(): GenerateContentResponse | undefined;
  override applyLLMRequestModifications(target): GenerateContentParameters;
}
```

`BeforeModelHookOutput` có thể trả synthetic response  -  hook có thể bypass Gemini API hoàn toàn, trả response giả. `BeforeToolHookOutput` có thể modify tool params trước khi execute. Đây là powerful pattern: **hook có thể override bất kỳ phần nào của agent loop**.

### Hook registry

```typescript
// hookRegistry.ts
export class HookRegistry {
  registerHook(
    config: HookConfig,
    eventName: HookEventName,
    options?: { matcher?: string; sequential?: boolean; source?: ConfigSource },
  ): void {
    this.entries.push({
      config, source, eventName,
      matcher: options?.matcher,
      sequential: options?.sequential,
      enabled: true,
    });
  }
}
```

Hook có thể có `matcher` (regex match tool name) và `sequential` (chạy tuần tự hay song song). `ConfigSource` định nghĩa priority: Runtime > Project > User > System > Extensions.

## Extension patterns khác

### GEMINI.md: Context files

Gemini CLI đọc file `GEMINI.md` ở project root và home directory. File này chứa instructions, context, convention  -  giống system prompt nhưng per-project. Nó được inject vào conversation như memory context.

### Custom commands

Slash commands (`/help`, `/clear`, `/model`, v.v.) cho phép user control agent behavior. Command system có registration và dispatch mechanism, extensible cho custom commands.

### MCP server integration

Như đã đề cập ở bài 7.4, MCP server có thể cấu hình qua settings:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "..." }
    }
  }
}
```

Mỗi MCP server thêm tools vào registry mà không cần modify Gemini CLI source.

### Agent-to-Agent (A2A)

`packages/a2a-server` triển khai giao thức Agent-to-Agent qua HTTP. Nó cho phép Gemini CLI agent giao tiếp với agent khác (Gemini hoặc không). A2A server là HTTP endpoint nhận request, chạy agent loop, trả response.

## Pattern tổng hợp cho AI engineer

Khi xây AI agent platform, bạn cần 4 lớp mở rộng:

**1. SDK layer**: cho developer nhúng agent vào app. API phải đơn giản (Agent → Session → Stream), type-safe, minimal config.

**2. Tool system**: cho developer thêm custom tool. Dùng Zod schema, `z.infer` cho type safety, `ModelVisibleError` cho graceful failure.

**3. Hook system**: cho developer customize lifecycle. Before/after mọi operation, có thể modify, block, hoặc inject. Command hook cho external integration, runtime hook cho in-process logic.

**4. Plugin protocol (MCP)**: cho external tool server. Chuẩn hóa tool discovery, authentication, communication. Bất kỳ server nào tuân thủ protocol đều plug được.

Bốn lớp này tạo nên **extensibility stack**: SDK cho embedding, Tool cho capability, Hook cho behavior, MCP cho ecosystem.

## So sánh Docmost và Gemini CLI extension

| | Docmost | Gemini CLI |
|---|---------|------------|
| **Extension point** | Plugin API (future) | SDK + Tools + Hooks + MCP |
| **Customization** | Config + env vars | GEMINI.md + settings + hooks |
| **Integration** | REST API + WebSocket | MCP + A2A protocol |
| **Custom logic** | Custom modules | Runtime hooks + custom tools |
| **Auth** | OAuth + JWT | OAuth + API key + Google Cloud |

Docmost extension chủ yếu qua API (web app pattern). Gemini CLI extension ở mọi tầng (agent platform pattern). Khi bạn xây AI product, extension model quyết định ecosystem growth.

## Điều cần giữ lại

Gemini CLI cho thấy cách thiết kế AI agent platform đầy đủ: SDK cho programmatic use, tool system cho capability, hook system cho lifecycle control, và MCP cho plugin ecosystem. Tất cả type-safe nhờ TypeScript generic và Zod schema. Khi bạn xây AI agent riêng, hãy bắt đầu từ SDK API design  -  nó buộc bạn nghĩ về developer experience trước khi optimize internal implementation. Sáu bài case study Gemini CLI kết thúc ở đây. Hy vọng bạn đã thấy TypeScript không chỉ cho web app mà còn cho AI agent production system.
