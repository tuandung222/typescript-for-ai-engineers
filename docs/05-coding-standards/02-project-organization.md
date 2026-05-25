---
title: 5.2 Cách tổ chức project TypeScript
---

# 5.2 Cách tổ chức project TypeScript

Tổ chức project là kiến trúc được viết thành folder. Một folder structure tốt giúp người mới đoán được code nằm ở đâu, giúp reviewer biết boundary nào bị chạm, và giúp team mở rộng tính năng mà không biến repo thành một mớ file rời rạc.

## App, package và module

Trong monorepo, nên phân biệt ba cấp.

**App** là thứ chạy được: web client, API server, worker, CLI. Trong Docmost, `apps/client` và `apps/server` là app.

**Package** là thư viện nội bộ được dùng lại: editor extension, shared types, SDK, UI kit, config package. Package không nên phụ thuộc ngược vào app.

**Module** là capability bên trong app: auth, workspace, storage, mail, queue, telemetry, model provider, retrieval, eval.

Một cấu trúc AI monorepo có thể như sau:

```text
apps/
  web/
  api/
  worker/
packages/
  shared-types/
  sdk/
  prompt-kit/
  eval-kit/
  tool-adapters/
```

## Tổ chức backend theo capability

Backend nên được tổ chức theo domain hoặc capability, không chỉ theo technical layer. Thay vì gom toàn bộ controllers vào một folder và toàn bộ services vào một folder, với codebase lớn bạn nên nhóm theo feature:

```text
src/
  modules/
    workspaces/
      workspace.controller.ts
      workspace.service.ts
      workspace.repository.ts
      workspace.dto.ts
    agents/
      agent.controller.ts
      agent.service.ts
      tool-registry.service.ts
    evals/
      eval.controller.ts
      eval-runner.service.ts
```

Cách này giúp một feature nằm gần nhau. Khi sửa workspace, bạn thấy controller, service, repository và DTO của workspace trong cùng vùng.

NestJS cũng khuyến khích module boundary. Mỗi module export đúng provider cần thiết, không mở tung mọi thứ.

## Tổ chức frontend theo route và feature

Frontend có thể tổ chức theo route hoặc feature:

```text
src/
  routes/
  features/
    documents/
    workspaces/
    settings/
  components/
  hooks/
  lib/
  api/
  styles/
```

`components` nên chứa component dùng chung. Feature-specific component nên nằm trong feature. `api` chứa client gọi backend. `lib` chứa utility ít phụ thuộc UI. `hooks` chứa hook dùng chung.

Một lỗi phổ biến là tạo một folder `components` khổng lồ chứa mọi thứ. Khi đó component domain và component shared bị trộn lẫn.

## Boundary direction

Một rule quan trọng là dependency nên đi theo một chiều. Ví dụ:

- App có thể import package.
- Package shared không import app.
- Domain service không phụ thuộc UI.
- Repository không gọi controller.
- Tool adapter không biết React component.

Nếu boundary direction bị phá, refactor sẽ khó. Trong AI systems, lỗi này thường xuất hiện khi prompt template, model call, UI state và database write bị trộn trong cùng function.

## Config và secrets

Config nên tập trung. Backend có thể có `EnvironmentService` hoặc config module. Frontend có config public nhưng không chứa secret. Docker và `.env.example` phải nói rõ biến nào cần thiết.

Không nên đọc `process.env` rải rác trong mọi service. Điều đó làm test khó và làm config không có schema.

## Điều cần giữ lại

Project organization tốt trả lời câu hỏi: app nào chạy, package nào shared, module nào sở hữu capability, dependency đi theo hướng nào, và boundary nào không được vượt qua. Với vai trò architect, bạn cần đọc folder structure như đọc bản thiết kế hệ thống.
