---
title: 3.3 Data validation và API contracts
---

# 3.3 Data validation và API contracts

TypeScript kiểm tra code trước khi chạy, nhưng API payload, database row, model output và webhook body vẫn là dữ liệu runtime. Đây là điểm mà nhiều người mới học TypeScript hiểu sai. Nếu dữ liệu đến từ bên ngoài process, type annotation không đủ. Bạn cần validation.

## Boundary là nơi nguy hiểm nhất

Boundary là nơi dữ liệu đi từ thế giới ngoài vào hệ thống hoặc từ module này sang module khác. Ví dụ:

- HTTP request body.
- Query params và route params.
- Webhook payload.
- Database result.
- Redis message.
- Queue job payload.
- LLM output.
- Tool call arguments.

Bên trong codebase, TypeScript giúp bạn giữ contract. Nhưng tại boundary, bạn phải chuyển `unknown` thành type đáng tin.

## DTO trong backend

Trong NestJS, DTO thường kết hợp class và validation decorators:

```ts
class CreatePageDto {
  title!: string;
  content?: string;
}
```

Trong production, DTO có thể đi cùng class-validator decorators như `IsString`, `IsOptional`, `MaxLength`. ValidationPipe đọc metadata đó để validate input.

Điểm quan trọng là DTO không phải chỉ để documentation. Nó là firewall chống dữ liệu bẩn đi sâu vào business logic.

## Zod và schema-first thinking

Một cách phổ biến khác là dùng Zod:

```ts
import {z} from 'zod';

const ToolCallSchema = z.object({
  name: z.string(),
  arguments: z.record(z.string(), z.unknown()),
});

type ToolCall = z.infer<typeof ToolCallSchema>;
```

Schema vừa validate runtime, vừa sinh type compile time. Với AI engineering, pattern này rất hữu ích vì LLM output thường là JSON nhưng có thể sai schema. Bạn không nên tin output chỉ vì prompt yêu cầu format.

## API contract giữa frontend và backend

Có ba cách phổ biến để giữ contract.

Cách thứ nhất là chia sẻ type trong monorepo. Frontend và backend import type từ package chung. Cách này nhanh nhưng phải cẩn thận để không import code backend vào frontend.

Cách thứ hai là sinh client từ OpenAPI hoặc schema. Backend là source of truth, frontend dùng generated client. Cách này phù hợp team lớn và API public.

Cách thứ ba là contract testing. Frontend và backend có tests đảm bảo request/response không lệch.

Docmost là monorepo nên có điều kiện tốt để chia sẻ package hoặc convention nội bộ. Nhưng dù dùng cách nào, nguyên tắc vẫn vậy: contract phải rõ và được kiểm tra tự động.

## LLM output cũng là API response

Một sai lầm phổ biến trong AI apps là xem model output như text tự nhiên vô hại. Nếu output điều khiển tool, workflow hoặc database write, nó phải được validate như API response. Ví dụ agent trả:

```json
{"tool":"deleteFile","path":"/tmp/a.txt"}
```

Bạn cần schema, permission check và policy trước khi execute. TypeScript type giúp mô tả shape, nhưng runtime guard mới bảo vệ hệ thống thật.

## Điều cần giữ lại

TypeScript type là contract trong code. Validation là contract ở runtime boundary. Một hệ thống nghiêm túc cần cả hai. Với AI systems, nguyên tắc này càng quan trọng vì model output linh hoạt, nhưng production system cần hành vi có giới hạn.
