---
title: 1.3 Runtime, module và async trong TypeScript
---

# 1.3 Runtime, module và async trong TypeScript

Một nhầm lẫn phổ biến là nghĩ TypeScript là một runtime riêng. Thực ra TypeScript là một lớp kiểm tra và biên dịch. Code TypeScript cuối cùng chạy như JavaScript trong Node.js hoặc browser. Vì vậy muốn hiểu TypeScript nghiêm túc, bạn phải hiểu ba thứ: runtime, module và async.

## TypeScript biến mất ở runtime

Khi bạn viết:

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

JavaScript sau khi compile về bản chất chỉ còn logic:

```js
function add(a, b) {
  return a + b;
}
```

Type annotation giúp compiler kiểm tra trước khi chạy, nhưng runtime không giữ chúng. Vì vậy nếu một API trả về `a` là string, runtime vẫn có thể chạy tới lỗi. Đây là lý do các framework backend thường dùng validation pipe, DTO, schema hoặc parser ở boundary.

## Node.js và browser

TypeScript có thể chạy trong hai môi trường lớn.

Browser dùng TypeScript qua bundler như Vite, Webpack hoặc esbuild. Bạn viết React component bằng `.tsx`, bundler biến code thành JavaScript, CSS và assets để browser tải.

Node.js dùng TypeScript cho backend, CLI, scripts, workers và tool servers. Trong production, backend thường được compile thành JavaScript trong `dist`, rồi chạy bằng `node dist/main.js` hoặc tương tự.

Docmost thể hiện cả hai. `apps/client` là React + Vite. `apps/server` là NestJS backend chạy trên Node với Fastify adapter.

## CommonJS và ES Modules

JavaScript có lịch sử module hơi phức tạp. Node cũ dùng CommonJS:

```ts
const fs = require('fs');
module.exports = something;
```

Modern TypeScript thường dùng ES Modules:

```ts
import fs from 'node:fs';
export function readConfig() {}
```

Trong Docmost, server `tsconfig.json` dùng `module: commonjs`, còn client dùng `module: ESNext` và `moduleResolution: bundler`. Điều này phản ánh thực tế: backend NestJS trong Node có thể dùng CommonJS, còn frontend Vite tối ưu theo bundler và ES modules.

## Promise và async

Trong TypeScript, async function luôn trả `Promise<T>`:

```ts
async function loadEmbedding(id: string): Promise<number[]> {
  const response = await fetch(`/api/embeddings/${id}`);
  return response.json() as Promise<number[]>;
}
```

Nếu quên `await`, bạn truyền một Promise thay vì dữ liệu thật. Đây là lỗi rất phổ biến khi chuyển từ script nhỏ sang application code.

Error handling cũng cần cẩn thận. `try/catch` bắt lỗi trong async function nếu bạn `await` đúng:

```ts
async function safeLoad(): Promise<void> {
  try {
    await loadEmbedding('doc_1');
  } catch (error) {
    console.error(error);
  }
}
```

Trong backend production, bạn hiếm khi chỉ `console.error`. Bạn cần logger, error class, request id, structured response và observability.

## Điều cần giữ lại

TypeScript giúp bạn viết contract trước khi chạy, nhưng runtime vẫn là JavaScript. Muốn đọc project thật, hãy hỏi: code này chạy ở browser hay Node, module system là gì, build output ở đâu, async boundary ở đâu, và dữ liệu ngoài được validate ở lớp nào.
