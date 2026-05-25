---
title: 4.3 Đọc backend Docmost
---

# 4.3 Đọc backend Docmost

Backend Docmost nằm trong `apps/server`. Đây là một NestJS application. Nếu bạn đến từ Python, hãy xem nó như một backend framework có dependency injection và module system rõ ràng. Đừng đọc từng file ngẫu nhiên. Hãy đi từ entry point tới root module, rồi từ root module tới feature modules.

## Entry point: main.ts

`apps/server/src/main.ts` tạo application:

```ts
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(...),
  ...
);
```

Dòng này cho biết ba điều. Thứ nhất, root module là `AppModule`. Thứ hai, HTTP server dùng Fastify. Thứ ba, generic `NestFastifyApplication` giúp TypeScript biết app object có API của Fastify integration.

Sau đó code set global prefix:

```ts
app.setGlobalPrefix('api', {
  exclude: ['robots.txt', 'share/:shareId/p/:pageSlug', 'mcp'],
});
```

Nghĩa là hầu hết routes backend nằm dưới `/api`, trừ một số route đặc biệt.

## Middleware và platform concerns

Trong `main.ts`, Docmost đăng ký multipart, cookie, IP handling, WebSocket adapter, CORS, validation pipe, interceptor và shutdown hooks. Đây là lớp platform concerns. Nó không phải business logic, nhưng quyết định request đi qua hệ thống như thế nào.

Ví dụ validation pipe:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    transform: true,
  }),
);
```

Đây là convention tốt: validate input ở boundary trước khi vào service layer.

## Root module: app.module.ts

`AppModule` import nhiều module. Khi đọc danh sách imports, bạn đang đọc bản đồ backend:

- `DatabaseModule` cho data access.
- `EnvironmentModule` cho config.
- `CollaborationModule` và `WsModule` cho realtime.
- `QueueModule` cho background jobs.
- `StorageModule` cho file storage.
- `MailModule` cho email.
- `SecurityModule` cho security controls.
- `TelemetryModule` cho telemetry.
- `ThrottleModule` cho rate limiting.

Một backend lớn nên được đọc như bản đồ capability. Nếu bạn muốn hiểu storage, đi vào `StorageModule`. Nếu muốn hiểu Redis, đi vào Redis integration. Nếu muốn hiểu import/export, đi vào ImportModule và ExportModule.

## Dependency injection

NestJS dùng dependency injection. Service không tự tạo dependency bằng `new` khắp nơi. Nó khai báo provider và được framework inject. Điều này giúp test dễ hơn và module boundary rõ hơn.

Với AI systems, dependency injection rất hữu ích khi bạn có nhiều model providers. Thay vì code gọi trực tiếp OpenAI ở mọi nơi, bạn tạo `ModelProviderService` hoặc adapter interface. Sau đó production dùng provider thật, test dùng fake provider.

## Enterprise modules và optional capability

Docmost có đoạn load enterprise modules bằng `require` trong try/catch. Đây là pattern plugin hoặc optional module. Open source build có thể không có enterprise module, cloud build có thể yêu cầu nó.

Bài học kiến trúc ở đây là capability có thể được đóng gói thành module và bật tắt theo edition hoặc environment. Với AI product, bạn có thể dùng pattern tương tự cho enterprise SSO, audit log, advanced eval hoặc private model provider.

## Điều cần giữ lại

Đọc backend TypeScript production cần một phương pháp. Bắt đầu từ `main.ts` để hiểu runtime setup. Đọc `AppModule` để hiểu capability map. Sau đó chọn module cụ thể và đi sâu vào controller, service, repository, DTO và tests. Không nên bắt đầu bằng grep ngẫu nhiên nếu chưa có bản đồ.
