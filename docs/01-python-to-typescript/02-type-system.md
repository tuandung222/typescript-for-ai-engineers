---
title: "1.2 Type system: type, interface, union và generic"
---

# 1.2 Type system: type, interface, union và generic

TypeScript type system đáng học không phải vì nó làm code trông học thuật hơn. Nó đáng học vì nó giúp bạn mô hình hóa trạng thái của hệ thống. Một AI application có rất nhiều trạng thái: request đang chờ, tool call thành công, tool call lỗi, document đã indexed, embedding chưa tạo, eval đang chạy, agent đã dừng. Nếu type mơ hồ, logic mơ hồ theo.

## Type alias và interface

Bạn có thể định nghĩa shape bằng `type` hoặc `interface`:

```ts
type ModelProvider = {
  id: string;
  name: string;
  supportsStreaming: boolean;
};

interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}
```

Trong nhiều codebase, `interface` hay dùng cho object có thể mở rộng, còn `type` linh hoạt hơn vì dùng được cho union, tuple và mapped types. Với người mới, quy tắc thực dụng là: dùng `type` cho hầu hết domain shapes, dùng `interface` khi framework hoặc convention của project ưu tiên interface.

## Union type

Union type cho phép một giá trị thuộc một trong nhiều dạng:

```ts
type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';
```

Đây là công cụ rất mạnh để thay thế string tự do. Thay vì để status là bất kỳ string nào, ta giới hạn nó trong bốn giá trị. Compiler có thể bắt lỗi typo và giúp autocomplete.

Với trạng thái phức tạp hơn, discriminated union còn hữu ích hơn:

```ts
type ToolResult =
  | {status: 'ok'; data: unknown}
  | {status: 'error'; message: string; retryable: boolean};
```

Khi bạn kiểm tra `status`, TypeScript tự thu hẹp type:

```ts
function renderToolResult(result: ToolResult): string {
  if (result.status === 'ok') {
    return 'Tool returned data';
  }
  return result.retryable ? `Retry: ${result.message}` : result.message;
}
```

Đây là cách tốt để mô hình hóa state machine nhỏ trong UI, backend và agent workflow.

## Generic

Generic giống như viết function hoặc type có tham số kiểu. Trong Python, bạn có thể thấy `list[str]` hoặc `dict[str, int]`. TypeScript dùng generic rất nhiều:

```ts
type ApiResponse<T> = {
  data: T;
  requestId: string;
};

const response: ApiResponse<User> = {
  data: {id: 'u1', name: 'Alice'},
  requestId: 'req_1',
};
```

Generic giúp bạn giữ quan hệ giữa input và output. React Query, NestJS, repository pattern, SDK clients và validation libraries đều dùng generic để diễn đạt contract.

## `unknown` tốt hơn `any`

`any` tắt kiểm tra type. Nó giống như nói với compiler: đừng hỏi nữa. Đôi khi bạn cần `any` khi làm việc với legacy library, nhưng nên coi nó là debt.

`unknown` an toàn hơn. Nó nói rằng ta chưa biết kiểu là gì, nên phải kiểm tra trước khi dùng:

```ts
function parsePayload(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }
  return JSON.stringify(payload);
}
```

Trong AI systems, dữ liệu từ model và tool nên bắt đầu bằng `unknown`, sau đó được parse và validate thành type cụ thể. Đây là cách nghĩ an toàn hơn so với tin rằng JSON luôn đúng schema.

## Type inference

Bạn không cần annotate mọi thứ. TypeScript inference khá mạnh:

```ts
const scores = [0.7, 0.9, 0.4];
const best = Math.max(...scores);
```

Compiler biết `scores` là `number[]` và `best` là `number`. Coding standard tốt thường khuyến khích annotate boundary, còn để inference bên trong function. Boundary gồm function exported, API DTO, domain model, database result, component props và public package API.

## Điều cần giữ lại

Type system không chỉ để làm hài lòng compiler. Nó là ngôn ngữ mô hình hóa domain. Với AI engineering, bạn nên dùng type để mô tả request, response, tool call, model config, eval result, job status và error states. Càng nhiều boundary, type càng quan trọng.
