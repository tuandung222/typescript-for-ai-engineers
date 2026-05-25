---
title: 0.1 Vì sao AI engineer nên học TypeScript?
---

# 0.1 Vì sao AI engineer nên học TypeScript?

Một data scientist thường bắt đầu bằng câu hỏi: model nào tốt, dữ liệu nào cần xử lý, metric nào cần tối ưu. Một software architect thường bắt đầu bằng câu hỏi khác: hệ thống gồm những boundary nào, module nào sở hữu dữ liệu nào, contract giữa client và server là gì, lỗi được lan truyền ra sao, và làm sao deploy an toàn khi team lớn lên.

TypeScript nằm đúng ở giao điểm này. Nó đủ gần JavaScript để chạy trong ecosystem web khổng lồ, nhưng có type system để codebase lớn bớt mơ hồ. Khi bạn xây một ứng dụng AI hiện đại, phần Python thường không sống một mình. Nó cần dashboard, API gateway, auth, billing, workflow orchestration, agent tool server, browser UI và integration với nhiều SaaS. Rất nhiều lớp trong số đó được viết bằng TypeScript.

## TypeScript có dễ học với người biết Python không?

Câu trả lời ngắn là có, nhưng không nên học như học thêm một syntax. Nếu bạn biết Python, bạn đã quen với function, object, class, async, package và type hint. Những nền tảng đó giúp bạn học nhanh. Nhưng bạn cần thay đổi ba mental model.

Thứ nhất, TypeScript chạy trên JavaScript runtime. Type checking xảy ra trước khi chạy, còn runtime thật vẫn là JavaScript. Nếu type nói một object có field `name`, điều đó không đảm bảo dữ liệu từ network thật sự có field đó. Vì vậy TypeScript cần đi cùng runtime validation ở boundary.

Thứ hai, ecosystem TypeScript là package-centric. Một project thật thường được điều khiển bởi `package.json`, package manager như npm hoặc pnpm, script, bundler, compiler và framework. Muốn đọc codebase, bạn phải đọc được toolchain.

Thứ ba, TypeScript được dùng nhiều trong application architecture. Bạn không chỉ viết thuật toán. Bạn viết component, service, controller, DTO, hook, provider, module, middleware, job processor, event handler và adapter.

## Vì sao chọn Docmost làm case study?

Docmost là một ứng dụng collaborative wiki và documentation software. Nó có nhiều yếu tố mà một AI engineer cần học:

- **Frontend:** React, Vite, Mantine UI, React Query, routing, state và configuration.
- **Backend:** NestJS, Fastify, validation pipe, module system, Redis, PostgreSQL, queue, storage và mail integration.
- **Realtime:** collaboration server, WebSocket, Redis adapter và Yjs ecosystem.
- **Monorepo:** `apps/client`, `apps/server`, `packages/*`, pnpm workspace và Nx.
- **Deployment:** Dockerfile nhiều stage, Docker Compose, environment variables, database và Redis.

Một AI product cũng có cấu trúc tương tự. Thay vì wiki pages, bạn có prompts, agents, tools, traces, retrieval, evals và model providers. Nhưng các câu hỏi kiến trúc vẫn giống nhau: config ở đâu, API boundary ở đâu, state ở đâu, background job ở đâu, và dữ liệu được validate như thế nào.

## Bản đồ giáo trình

- **Phần 1:** chuyển mental model từ Python sang TypeScript.
- **Phần 2:** học toolchain: Node, pnpm, npm scripts, tsconfig, build, dev và monorepo.
- **Phần 3:** hiểu các pattern ứng dụng: React frontend, NestJS backend và API contracts.
- **Phần 4:** đọc Docmost như một case study production.
- **Phần 5:** xây coding standard và convention cho TypeScript project.
- **Phần 6:** nối TypeScript sang AI engineering và solution architecture.

Nếu chỉ nhớ một ý, hãy nhớ: TypeScript không chỉ giúp code ít lỗi hơn. Nó giúp team diễn đạt contract giữa các phần của hệ thống. Với AI systems, contract rõ là điều kiện để sản phẩm không sụp khi model, prompt, tool và business logic thay đổi cùng lúc.
