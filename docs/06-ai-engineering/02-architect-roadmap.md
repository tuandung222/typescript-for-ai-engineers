---
title: 6.2 Roadmap từ data scientist sang TypeScript architect
---

# 6.2 Roadmap từ data scientist sang TypeScript architect

Chuyển từ data scientist sang software architect hoặc AI solution architect không phải là bỏ Python. Đó là mở rộng phạm vi tư duy từ model sang hệ thống. TypeScript là một cầu nối tốt vì nó buộc bạn học UI, API, runtime, module boundary, deployment và contracts.

## Giai đoạn 1: học ngôn ngữ đủ dùng

Mục tiêu không phải thuộc mọi advanced type trick. Mục tiêu là viết được code rõ và đọc được project thật.

Cần nắm:

- `const`, `let`, object, array, function.
- `type`, `interface`, union, generic.
- `Promise`, `async`, `await`.
- Module import/export.
- Error handling.
- Basic React component và backend route.

Bài tập tốt: viết một API client nhỏ gọi một endpoint, validate response bằng Zod, render kết quả bằng React.

## Giai đoạn 2: học toolchain

Cần nắm:

- `package.json` và npm scripts.
- npm, pnpm, lockfile.
- `tsconfig.json`.
- Vite cho frontend.
- NestJS hoặc một backend framework.
- Docker basics.
- Environment variables.

Bài tập tốt: clone một repo TypeScript nhỏ, chạy dev server, build production, sửa một component, thêm một endpoint và viết test.

## Giai đoạn 3: học project organization

Cần nắm:

- App vs package.
- Feature module.
- API layer.
- Service layer.
- Repository hoặc data access layer.
- Shared types.
- Config module.
- Testing strategy.

Bài tập tốt: đọc Docmost theo bản đồ trong Phần 4. Không cần hiểu từng dòng. Mục tiêu là vẽ được kiến trúc source và runtime.

## Giai đoạn 4: học architecture decision

Khi đã đọc được code, hãy hỏi câu hỏi architect:

- Vì sao dùng monorepo?
- Vì sao backend dùng NestJS?
- Vì sao frontend dùng React Query?
- Vì sao cần Redis?
- Vì sao cần queue?
- Vì sao cần Docker multi-stage build?
- Boundary nào nên shared type, boundary nào nên schema?
- Khi nào nên tách service?

Đây là điểm bạn chuyển từ coder sang architect. Bạn không chỉ biết làm, bạn biết vì sao làm như vậy.

## Giai đoạn 5: nối sang AI solution architecture

Cuối cùng, hãy áp dụng cùng pattern cho AI systems:

- Model provider adapter.
- Tool registry.
- Agent runtime.
- Trace store.
- Eval pipeline.
- Prompt versioning.
- Permission model.
- Cost and latency monitoring.
- Human review workflow.

TypeScript đặc biệt tốt cho các lớp này vì chúng là application engineering, không phải core training.

## Điều cần giữ lại

Roadmap tốt nhất là học qua dự án thật. Đừng chỉ học syntax. Hãy học cách một project được install, build, run, test, deploy và tổ chức. Docmost là một case study đủ lớn để luyện mắt architect, nhưng vẫn đủ gần web application để bạn không bị lạc trong distributed systems quá phức tạp.
