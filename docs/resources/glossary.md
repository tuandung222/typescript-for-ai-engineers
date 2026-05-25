---
title: Glossary
---

# Glossary

## TypeScript

Ngôn ngữ mở rộng JavaScript bằng static type checking. TypeScript compile về JavaScript, nên type annotation không tồn tại như runtime guarantee.

## Node.js

JavaScript runtime phía server. TypeScript backend thường compile thành JavaScript rồi chạy bằng Node.js.

## package.json

File trung tâm của project JavaScript hoặc TypeScript, chứa metadata, dependencies, scripts và một số cấu hình package manager.

## pnpm

Package manager cho JavaScript ecosystem, nổi bật với workspace support và cách lưu package tiết kiệm disk.

## Workspace

Cơ chế quản lý nhiều package trong cùng một repo. Monorepo TypeScript thường dùng workspace để liên kết app và package nội bộ.

## Nx

Tool quản lý task graph, build cache và workflow trong monorepo. Docmost dùng Nx để chạy build và dev targets.

## tsconfig.json

File cấu hình TypeScript compiler, gồm target JavaScript, module system, strictness, JSX mode, path aliases và output behavior.

## Vite

Frontend build tool và dev server hiện đại, thường dùng cho React TypeScript apps.

## React

UI library phổ biến để xây frontend. Với TypeScript, React component thường được typed qua props.

## NestJS

Backend framework cho Node.js và TypeScript, dùng module, controller, service, provider, dependency injection, pipe và interceptor.

## DTO

Data Transfer Object, object mô tả dữ liệu đi qua boundary như request body hoặc response. DTO thường đi cùng validation.

## Zod

Thư viện schema validation cho TypeScript. Zod cho phép validate runtime và suy ra static type từ schema.

## Monorepo

Một repository chứa nhiều app và package liên quan. Monorepo giúp phối hợp thay đổi nhưng cần convention và tooling tốt.

## Type-only import

Import chỉ dùng cho type checking, viết bằng `import type`. Nó giúp phân biệt dependency runtime và dependency compile-time.

## Discriminated union

Union type có một field chung như `status` hoặc `kind` để TypeScript thu hẹp type theo nhánh logic.

## Runtime validation

Quá trình kiểm tra dữ liệu khi chương trình chạy. TypeScript static type không thay thế runtime validation ở API boundary.
