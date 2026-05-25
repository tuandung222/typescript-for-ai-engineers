---
title: Checklist học và review TypeScript project
---

# Checklist học và review TypeScript project

## Khi mở một repo TypeScript mới

- **Đọc root package.json:** xác định package manager, scripts, dependencies và workspaces.
- **Đọc lockfile:** xác định npm, pnpm hoặc yarn và mức độ reproducible.
- **Đọc tsconfig:** hiểu target, module, strictness, JSX, paths và output.
- **Đọc README hoặc docs:** lấy command chính thức nếu có.
- **Đọc .env.example:** xác định database, Redis, secret, storage và provider config.
- **Đọc Dockerfile:** hiểu build stage, runtime stage và command production.
- **Đọc docker-compose.yml:** hiểu service graph local.
- **Tìm entry point:** frontend thường là `main.tsx`, backend thường là `main.ts` hoặc server file.

## Khi review code TypeScript

- **Boundary type rõ:** exported function, API request, response, DTO và component props có type rõ.
- **Không lạm dụng any:** dùng `unknown` và validation ở dữ liệu ngoài.
- **Nullability được xử lý:** không giả định field luôn tồn tại nếu type nói có thể thiếu.
- **Async an toàn:** promise được await hoặc xử lý có chủ ý.
- **Error có cấu trúc:** không ném string, không nuốt lỗi âm thầm.
- **Module boundary đúng:** service không import ngược controller, package shared không import app.
- **Runtime validation có mặt:** request body, model output và webhook payload được validate.
- **Test phù hợp:** logic quan trọng có unit hoặc integration test.
- **Config tập trung:** không đọc env rải rác khắp codebase.
- **Secret không lộ frontend:** API keys và token nhạy cảm chỉ ở backend.

## Khi thiết kế AI application bằng TypeScript

- **Model provider adapter:** không gọi provider trực tiếp ở mọi nơi.
- **Tool schema:** mỗi tool có input schema, output type và permission check.
- **Trace schema:** model call, tool call, latency, token usage và errors được lưu có cấu trúc.
- **Eval pipeline:** eval result có type và version.
- **Cost tracking:** token usage và provider cost được ghi nhận.
- **Safety boundary:** model output không trực tiếp thực hiện action nguy hiểm.
