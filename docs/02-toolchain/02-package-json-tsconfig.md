---
title: 2.2 package.json và tsconfig.json
---

# 2.2 package.json và tsconfig.json

Nếu bạn muốn đọc một project TypeScript nghiêm túc, hai file đầu tiên nên mở là `package.json` và `tsconfig.json`. Một file trả lời câu hỏi project chạy bằng gì. File còn lại trả lời câu hỏi compiler hiểu code như thế nào.

## package.json là bản đồ vận hành

Trong Python, bạn có thể xem `pyproject.toml` để biết dependencies và tool config. Trong TypeScript, `package.json` còn quan trọng hơn vì nó chứa scripts.

Một script như:

```json
"client:dev": "nx run client:dev"
```

nói rằng root project không trực tiếp chạy Vite. Nó nhờ Nx chạy target `dev` của project `client`. Một script như:

```json
"start": "pnpm --filter ./apps/server run start:prod"
```

nói rằng production entry nằm ở `apps/server`, không phải root.

Khi review một codebase, hãy phân loại scripts thành nhóm:

- **Development:** `dev`, `client:dev`, `server:dev`.
- **Build:** `build`, `server:build`, `client:build`.
- **Production:** `start`, `server:start`, `collab`.
- **Database:** `migration:up`, `migration:latest`, `migration:create`.
- **Quality:** `test`, `lint`, `format`.

Cách phân loại này giúp bạn hiểu lifecycle của project.

## dependencies và devDependencies

`dependencies` là package cần ở runtime production. `devDependencies` là package phục vụ build, test, lint hoặc development.

Ví dụ backend Docmost có `@nestjs/core`, `kysely`, `ioredis`, `zod`, `bullmq` trong dependencies. Đây là các thư viện app cần khi chạy. Nó có `typescript`, `jest`, `eslint`, `prettier`, `ts-node` trong devDependencies. Đây là công cụ phát triển.

Khi build Docker production, nhiều project chỉ cài production dependencies để giảm image size và attack surface.

## tsconfig.json là hợp đồng với compiler

`tsconfig.json` kiểm soát TypeScript compiler. Một số option quan trọng:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "baseUrl": "./",
    "paths": {
      "@docmost/db/*": ["./src/database/*"]
    }
  }
}
```

`target` nói JavaScript output hướng tới version nào. `module` nói module system output. `outDir` nói build output nằm đâu. `strict` bật nhóm kiểm tra nghiêm ngặt. `paths` tạo import alias để tránh relative path quá dài.

## strict không phải công tắc đơn giản

Trong Docmost server, `strict` bật nhưng một số option như `noImplicitAny` và `strictNullChecks` được đặt false. Client thậm chí đặt `strict: false`. Đây là một quan sát thực tế quan trọng: production codebase có thể chọn trade-off để duy trì tốc độ phát triển hoặc tương thích legacy.

Với người học, tôi khuyến nghị khác: khi tạo project mới, hãy bật strict càng sớm càng tốt. Nhưng khi đọc project thật, đừng vội kết luận codebase kém chỉ vì một option chưa strict. Hãy hỏi bối cảnh: lịch sử dự án, migration cost, framework, thư viện third-party và tốc độ release.

## noEmit và bundler mode

Client Docmost dùng Vite, nên `tsconfig` có:

```json
"noEmit": true,
"moduleResolution": "bundler",
"jsx": "react-jsx"
```

`noEmit` nghĩa là TypeScript chỉ typecheck, không xuất file JavaScript. Vite chịu trách nhiệm bundling. Đây là pattern phổ biến trong frontend hiện đại.

Backend NestJS thì build bằng Nest CLI, output nằm trong `dist`. Vì vậy server có `outDir: ./dist`.

## Điều cần giữ lại

`package.json` cho bạn biết cách project sống. `tsconfig.json` cho bạn biết compiler nhìn code ra sao. Khi học TypeScript để làm architecture, đừng bỏ qua hai file này. Chúng thường tiết lộ nhiều quyết định kỹ thuật hơn một file source bất kỳ.
