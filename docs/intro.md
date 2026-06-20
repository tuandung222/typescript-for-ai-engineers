---
title: Giới thiệu TypeScript for AI Engineers
---

# TypeScript for AI Engineers

Bạn đến từ Python, quen với notebook, model training, data pipeline, experiment tracking và paper implementation. Khi bước sang software architect, AI solution architect hoặc AI engineer, bạn sẽ gặp một thế giới khác: frontend, backend, API contract, event, queue, auth, deployment, observability và codebase nhiều module. TypeScript là một trong những ngôn ngữ quan trọng nhất để bước vào thế giới đó.

Điều đáng mừng là TypeScript không xa lạ như vẻ ngoài của nó. Nếu Python giúp bạn suy nghĩ nhanh về dữ liệu và thuật toán, TypeScript giúp bạn xây hệ thống lớn với hợp đồng rõ hơn giữa các phần. TypeScript không thay thế Python trong machine learning. Nó bổ sung một năng lực khác: xây sản phẩm, SDK, UI, backend service, agent tool server và integration layer quanh AI.

Giáo trình này dùng hai open source project làm tư liệu nghiên cứu. **Docmost** (`docmost/docmost`) là ứng dụng wiki và documentation collaborative, đại diện cho pattern web app SaaS: React frontend, NestJS backend, PostgreSQL, Redis, Docker, pnpm workspace và Nx monorepo. **Gemini CLI** (`google-gemini/gemini-cli`, Apache 2.0) là AI agent chạy trên terminal, đại diện cho pattern AI tooling: agent loop, tool registry, MCP plugin system, React + Ink terminal UI, SDK package và esbuild bundling. Hai case study bổ sung nhau — Docmost dạy bạn cách tổ chức web app, Gemini CLI dạy bạn cách tổ chức AI agent.

## Mục tiêu của sách

Sau khi học xong bản đầu của sách này, bạn cần đạt bốn năng lực.

Thứ nhất, bạn hiểu TypeScript khác Python ở đâu. Sự khác biệt không chỉ là dấu ngoặc nhọn hay semicolon. Sự khác biệt nằm ở runtime JavaScript, static type checking, module system, event loop và cách ecosystem tổ chức package.

Thứ hai, bạn biết install, build và run một project TypeScript. Bạn cần đọc được `package.json`, hiểu `scripts`, biết `pnpm install`, `npm run build`, `npm run dev`, `tsconfig.json`, bundler như Vite, backend framework như NestJS và monorepo tool như Nx.

Thứ ba, bạn đọc được cấu trúc một codebase lớn. Khi nhìn thấy `apps/client`, `apps/server`, `packages`, `Dockerfile`, `.env.example`, `pnpm-workspace.yaml`, bạn không hoảng. Bạn biết đâu là entry point, đâu là dependency boundary, đâu là config, đâu là runtime service.

Thứ tư, bạn có coding standard và convention để viết code TypeScript đủ nghiêm túc: đặt tên, tổ chức module, định nghĩa type, validate boundary, xử lý async error, test, lint, format, review và refactor.

## Cách đọc

Nếu bạn mới học TypeScript, hãy đọc Phần 0 đến Phần 2 trước. Đừng bắt đầu bằng Docmost ngay. Một production monorepo có quá nhiều thứ cùng lúc, nên bạn cần mental model trước.

Nếu bạn đã biết JavaScript cơ bản nhưng chưa làm TypeScript nghiêm túc, hãy đọc Phần 1 và Phần 5 kỹ. Hai phần này giúp bạn chuyển từ viết code chạy được sang viết code có contract.

Nếu bạn đang muốn trở thành software architect hoặc AI solution architect, hãy tập trung vào Phần 4, Phần 6 và Phần 7. Phần 4 (Docmost) dạy pattern web app. Phần 7 (Gemini CLI) dạy pattern AI agent. Mục tiêu không phải chỉ biết syntax, mà là đọc được quyết định kiến trúc trong codebase thật.
