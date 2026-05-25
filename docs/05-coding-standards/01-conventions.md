---
title: 5.1 Coding conventions cho TypeScript
---

# 5.1 Coding conventions cho TypeScript

Coding convention không phải chuyện thẩm mỹ nhỏ. Trong một codebase TypeScript lớn, convention là cách team giảm entropy. Nếu mỗi người đặt tên, tổ chức file, xử lý error và định nghĩa type theo một kiểu, codebase sẽ khó đọc hơn dù compiler không báo lỗi.

## Nguyên tắc 1: type ở boundary, inference bên trong

Annotate rõ ở boundary:

- Exported function.
- Public class method.
- Component props.
- API request và response.
- DTO và schema.
- Database access result.
- Package public API.

Bên trong function, hãy để TypeScript inference khi rõ ràng.

```ts
type RankInput = {
  query: string;
  documents: string[];
};

export function rankDocuments(input: RankInput): string[] {
  const normalizedQuery = input.query.toLowerCase();
  return input.documents.filter((doc) => doc.toLowerCase().includes(normalizedQuery));
}
```

Không cần annotate `normalizedQuery: string` vì compiler biết. Nhưng `RankInput` và return type của exported function nên rõ.

## Nguyên tắc 2: tránh `any`, dùng `unknown` ở dữ liệu chưa tin

`any` làm mất lợi ích của TypeScript. Nếu dữ liệu chưa biết, dùng `unknown`, rồi validate hoặc narrow.

```ts
function readModelOutput(output: unknown): string {
  if (typeof output === 'string') {
    return output;
  }
  throw new Error('Model output must be a string');
}
```

Với AI systems, model output và tool result nên được xem là `unknown` cho tới khi được parse thành schema hợp lệ.

## Nguyên tắc 3: dùng discriminated union cho state

Đừng dùng nhiều boolean để mô tả trạng thái phức tạp:

```ts
type BadState = {
  isLoading: boolean;
  isError: boolean;
  data?: string;
  error?: string;
};
```

Cách tốt hơn:

```ts
type LoadState =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'success'; data: string}
  | {status: 'error'; message: string};
```

Union type làm state machine rõ hơn. UI và workflow ít rơi vào trạng thái vô nghĩa như vừa loading vừa success.

## Nguyên tắc 4: đặt tên theo vai trò

Convention phổ biến:

- `PascalCase` cho type, interface, class, React component.
- `camelCase` cho variable, function, method.
- `UPPER_SNAKE_CASE` cho hằng số global thực sự bất biến.
- File React component có thể dùng `PascalCase.tsx` hoặc `kebab-case.tsx` tùy repo, nhưng phải nhất quán.
- Hook bắt đầu bằng `use`, ví dụ `useCurrentWorkspace`.
- Boolean nên bắt đầu bằng `is`, `has`, `can`, `should`, ví dụ `isCloud`, `hasPermission`, `canEdit`.

Tên tốt nên nói được domain, không chỉ nói type. `userMap` tốt hơn `data`. `workspacePermission` tốt hơn `obj`.

## Nguyên tắc 5: import rõ và có chủ ý

Dùng `import type` cho type-only imports:

```ts
import type {User} from './types';
```

Tránh import vòng tròn. Tránh barrel file quá rộng nếu nó làm dependency graph mờ đi. Với monorepo, phải phân biệt import nội bộ cùng package và import qua package boundary.

## Nguyên tắc 6: error là contract

Đừng ném string. Dùng Error hoặc error class:

```ts
throw new Error('Workspace not found');
```

Ở backend, error nên có status code, message an toàn cho user, internal context cho log và request id. Với AI systems, lỗi model provider, lỗi rate limit, lỗi safety policy và lỗi tool execution nên được phân loại rõ.

## Nguyên tắc 7: async phải được await hoặc trả về có chủ ý

Nếu function async được gọi mà không await, hãy làm rõ lý do. Fire-and-forget trong backend rất dễ gây lỗi mất dấu. Nếu cần background job, dùng queue thay vì âm thầm chạy promise.

## Điều cần giữ lại

Coding convention tốt làm codebase dễ đọc và dễ refactor. TypeScript cho bạn công cụ, nhưng convention cho team cách dùng công cụ. Với AI engineering, convention càng quan trọng vì hệ thống có nhiều boundary không chắc chắn: model output, tool calls, external APIs và user input.
