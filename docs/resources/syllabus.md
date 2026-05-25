---
title: Syllabus
---

# Syllabus

Syllabus này thiết kế cho người đã biết Python, data science hoặc research engineering, nhưng muốn học TypeScript để làm software architect, AI solution architect hoặc AI engineer.

## Lộ trình tổng thể

| Phần | Chủ đề | Mục tiêu |
|---|---|---|
| Phần 0 | Định hướng | Hiểu vì sao TypeScript quan trọng với AI product engineering |
| Phần 1 | Python sang TypeScript | Nắm mental model, type system, runtime, module và async |
| Phần 2 | Toolchain | Biết install, build, run, đọc package.json, tsconfig, pnpm và Nx |
| Phần 3 | Application patterns | Hiểu React frontend, NestJS backend và API contracts |
| Phần 4 | Docmost case study | Đọc kiến trúc một TypeScript monorepo production |
| Phần 5 | Coding standard | Xây convention cho naming, type, project organization, test, lint và review |
| Phần 6 | AI engineering | Áp dụng TypeScript vào LLM apps, agents, tools, traces và evals |

## Bài thực hành khuyến nghị

- Tạo một TypeScript function library nhỏ và bật strict mode.
- Viết một React component có props type rõ.
- Viết một API client có runtime validation bằng Zod.
- Tạo một NestJS endpoint nhận DTO và trả response typed.
- Clone Docmost, đọc `package.json`, `.env.example`, `Dockerfile`, `apps/server/src/main.ts` và `apps/client/src/main.tsx`.
- Chạy thử Docmost bằng Docker Compose.
- Chạy Docmost từ source nếu môi trường local cho phép.
- Thiết kế một mini agent tool registry bằng TypeScript.

## Thứ tự học khuyến nghị

Nếu bạn chưa biết JavaScript, hãy đọc Phần 1 chậm và tự viết lại ví dụ. Đừng vội vào React hoặc NestJS.

Nếu bạn biết frontend cơ bản, hãy tập trung vào Phần 2, Phần 4 và Phần 5 để hiểu project production.

Nếu bạn hướng tới AI solution architect, hãy đọc Phần 4 như một bài phân tích kiến trúc, rồi tự vẽ lại kiến trúc tương tự cho một LLM application.
