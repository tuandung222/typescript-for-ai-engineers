---
title: 1.1 Mental model từ Python sang TypeScript
---

# 1.1 Mental model từ Python sang TypeScript

Khi người biết Python nhìn TypeScript lần đầu, họ thường chú ý vào bề mặt: dấu ngoặc nhọn, `const`, `let`, dấu hai chấm sau tên biến, `interface`, `type`, `async` và `await`. Nhưng nếu chỉ học bề mặt, bạn sẽ dễ viết TypeScript như Python có syntax khác. Cách học tốt hơn là nhìn vào câu hỏi mà mỗi ngôn ngữ tối ưu.

Python tối ưu cho tốc độ biểu đạt. Bạn có thể mở notebook, đọc CSV, train model, thử ý tưởng, vẽ biểu đồ và sửa code liên tục. TypeScript tối ưu cho sản phẩm web và hệ thống nhiều boundary. Bạn viết code để frontend gọi backend, backend gọi database, worker xử lý queue, SDK gọi external API, và nhiều người cùng refactor mà không phá contract.

## Python type hint và TypeScript type system

Python có type hint, nhưng runtime Python không bắt buộc thực thi type hint. Bạn cần mypy, pyright hoặc Pydantic để kiểm tra hoặc validate. TypeScript thì lấy static type checking làm trung tâm trải nghiệm developer. Khi bạn viết:

```ts
function scoreAnswer(answer: string, maxScore: number): number {
  return Math.min(answer.length / 100, maxScore);
}
```

TypeScript kiểm tra rằng `answer` là string và return là number trước khi code chạy. Nhưng sau khi compile, type annotation biến mất. Runtime JavaScript không còn biết `answer` là string. Vì vậy nếu `answer` đến từ API request, bạn vẫn phải validate.

Điểm này rất quan trọng với AI systems. Model output, tool result và webhook payload đều là dữ liệu không đáng tin tuyệt đối. TypeScript giúp code bên trong hệ thống rõ ràng hơn, nhưng boundary từ ngoài vào vẫn cần schema validation bằng Zod, class-validator hoặc một cơ chế tương tự.

## `dict` của Python và object của TypeScript

Trong Python, bạn quen với dict:

```python
user = {"id": "u1", "name": "Alice"}
```

Trong TypeScript, object literal rất giống:

```ts
type User = {
  id: string;
  name: string;
};

const user: User = {id: 'u1', name: 'Alice'};
```

Điểm khác là TypeScript cố gắng kiểm tra shape của object. Nếu thiếu `name`, compiler có thể báo lỗi. Nếu field có kiểu sai, compiler cũng báo lỗi. Với codebase lớn, shape checking giúp bạn refactor tự tin hơn.

## `None` và `null` hoặc `undefined`

Python có `None`. JavaScript có cả `null` và `undefined`. Đây là nguồn lỗi phổ biến. `undefined` thường nghĩa là giá trị chưa được gán hoặc property không tồn tại. `null` thường là giá trị rỗng có chủ ý. TypeScript có thể kiểm tra hai thứ này nếu bật `strictNullChecks`.

Trong thực tế, bạn nên xem nullability là một phần của contract. Nếu API có thể trả `null`, type phải nói rõ. Nếu function không chấp nhận missing value, đừng để type quá rộng.

```ts
type SearchResult = {
  title: string;
  snippet: string | null;
};
```

Dòng trên nói rằng `snippet` có thể là string hoặc null. Người dùng type này buộc phải xử lý trường hợp null nếu cấu hình strict đủ mạnh.

## Import, module và package

Python có `import pandas as pd`. TypeScript có nhiều dạng import:

```ts
import {QueryClient} from '@tanstack/react-query';
import App from './App';
import type {User} from './types';
```

`import type` là cách nói rằng import này chỉ phục vụ type checking, không cần tồn tại ở runtime. Trong project lớn, phân biệt import runtime và import type giúp bundler và compiler hiểu code tốt hơn.

## Async gần giống nhưng event loop quan trọng hơn

Python có `asyncio`. TypeScript chạy trên JavaScript event loop trong Node hoặc browser. `async` và `await` nhìn rất giống Python:

```ts
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as Promise<User>;
}
```

Nhưng cần nhớ rằng hầu hết IO trong Node là non-blocking. Backend TypeScript thường dùng async ở mọi nơi: database, Redis, HTTP call, file storage, queue và model provider. Nếu bạn quên `await`, bạn không nhận giá trị mà nhận một `Promise`.

## Điều cần giữ lại

Học TypeScript từ Python không khó nếu bạn hiểu đúng vai trò. Python mạnh cho exploratory computing và ML core. TypeScript mạnh cho product engineering, contracts, UI, API và integration. TypeScript không đảm bảo dữ liệu ngoài là đúng, nhưng giúp nội bộ codebase diễn đạt shape và intent rõ hơn rất nhiều.
