---
title: 2.3 Monorepo với pnpm workspace và Nx
---

# 2.3 Monorepo với pnpm workspace và Nx

Một project nhỏ có thể chỉ có một `src` folder. Một sản phẩm lớn thường có nhiều app và package: frontend, backend, worker, shared library, editor extension, SDK, scripts. Khi tất cả nằm trong một repo, ta gọi đó là monorepo.

Docmost là một monorepo. Root `package.json` khai báo workspace:

```json
"workspaces": {
  "packages": [
    "apps/*",
    "packages/*"
  ]
}
```

Repo cũng có `pnpm-workspace.yaml` để pnpm biết những folder nào là workspace packages.

## Vì sao dùng monorepo?

Monorepo giúp nhiều phần của hệ thống thay đổi cùng nhau. Nếu backend API thay đổi và frontend cần cập nhật, một pull request có thể sửa cả hai. Nếu có package shared, frontend và backend có thể dùng cùng version nội bộ.

Với AI systems, monorepo có thể chứa:

- Web app quản trị.
- API server.
- Agent runtime.
- Evaluation harness.
- Shared SDK.
- Prompt templates.
- Tool adapters.
- Infrastructure scripts.

Điểm mạnh là coordination. Điểm yếu là repo dễ phình to, build chậm và dependency graph phức tạp nếu không có tool hỗ trợ.

## pnpm workspace giải quyết gì?

pnpm workspace cho phép package nội bộ phụ thuộc nhau bằng `workspace:*`. Trong Docmost root dependencies có:

```json
"@docmost/editor-ext": "workspace:*"
```

Điều này nói rằng package `@docmost/editor-ext` đến từ cùng workspace, không phải tải từ npm registry. Khi bạn sửa package nội bộ, app dùng package đó có thể build lại theo dependency graph.

pnpm cũng tiết kiệm disk hơn npm truyền thống nhờ content-addressable store. Với monorepo nhiều dependencies, điều này rất hữu ích.

## Nx giải quyết gì?

Nx là tool quản lý task graph. Trong root scripts của Docmost:

```json
"build": "nx run-many -t build"
```

Nghĩa là build nhiều project có target `build`. `nx.json` khai báo:

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

`dependsOn: ["^build"]` nghĩa là khi build một project, hãy build dependencies của nó trước. `cache: true` cho phép Nx cache kết quả task. Trong repo lớn, caching giúp build nhanh hơn rất nhiều.

## Cách đọc monorepo

Khi mở một monorepo lạ, hãy đi theo thứ tự:

1. Root `package.json` để biết package manager, scripts và workspace.
2. `pnpm-workspace.yaml` hoặc workspace config để biết các package.
3. `nx.json`, `turbo.json` hoặc tool tương tự để biết task graph.
4. `apps/*` để biết executable applications.
5. `packages/*` để biết shared libraries.
6. Dockerfile và workflow để biết build production.

Trong Docmost, `apps/client` là frontend, `apps/server` là backend, `packages/editor-ext` là package editor extension. Đây là tổ chức dễ hiểu: app là thứ chạy, package là thứ được dùng lại.

## Điều cần giữ lại

Monorepo không phải chỉ là nhiều folder trong một repo. Nó là một cách quản lý dependency, build graph và release coordination. Với AI engineering, monorepo rất hữu ích khi bạn cần đồng bộ UI, API, tools, evaluators và shared schema. Nhưng monorepo cần convention rõ, nếu không nó biến thành một thư mục khổng lồ khó kiểm soát.
