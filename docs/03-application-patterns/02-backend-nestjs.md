---
title: 3.2 Backend TypeScript với NestJS
---

# 3.2 Backend TypeScript với NestJS

Backend TypeScript thường được xây bằng Express, Fastify, NestJS, Hono hoặc một framework tương tự. Docmost dùng NestJS với Fastify adapter. Đây là lựa chọn đáng học vì NestJS thể hiện rõ tư duy kiến trúc module, dependency injection, controller, service và provider.

## NestJS nhìn giống gì với người biết Python?

Nếu bạn biết Python backend, NestJS có thể được so sánh với FastAPI ở chỗ đều dùng decorator và type để mô tả endpoint, dependency và validation. Nhưng NestJS gần với kiến trúc enterprise hơn: module là đơn vị tổ chức lớn, service được inject, interceptor và pipe xử lý cross-cutting concerns.

Trong `apps/server/src/main.ts`, Docmost tạo app bằng:

```ts
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(...),
  ...
);
```

Dòng này nói rằng `AppModule` là root module, còn HTTP runtime dùng Fastify.

## AppModule là bản đồ backend

Trong `apps/server/src/app.module.ts`, ta thấy nhiều module được import: core, database, environment, collaboration, websocket, queue, static, health, import, export, storage, mail, security, telemetry và throttle. Đây là cách NestJS tổ chức backend theo capability.

Một backend tốt không nên nhét mọi thứ vào một file route. Nó nên có module boundary. Ví dụ:

- **DatabaseModule:** kết nối database và cung cấp repository hoặc query builder.
- **StorageModule:** xử lý local, S3 hoặc Azure storage.
- **MailModule:** gửi email qua SMTP hoặc provider.
- **QueueModule:** xử lý job bất đồng bộ.
- **SecurityModule:** security controls.
- **HealthModule:** health check cho deployment.

Với AI systems, bạn có thể có module tương tự: ModelProviderModule, RetrievalModule, AgentRuntimeModule, EvalModule, TraceModule và ToolRegistryModule.

## Pipes, interceptors và adapters

NestJS có nhiều lớp xử lý request.

Validation pipe giúp validate và transform input. Docmost dùng:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    transform: true,
  }),
);
```

`whitelist: true` loại bỏ field không khai báo trong DTO. Đây là một security và correctness control quan trọng. Không nên để client gửi field tùy ý rồi backend vô tình dùng chúng.

Interceptor có thể biến đổi response, log, audit hoặc thêm metadata. Adapter cho phép NestJS chạy trên Fastify thay vì Express.

## Environment service

Backend production không hardcode config. Nó đọc environment variables qua một service. Docmost có `EnvironmentService`, dùng để lấy Redis URL, iframe config và nhiều settings khác. Đây là pattern tốt vì code business không nên đọc `process.env` rải rác khắp nơi.

Với AI applications, config còn quan trọng hơn: model provider, API key, rate limit, max tokens, safety policy, storage, queue và tracing endpoint đều cần được quản lý tập trung.

## Điều cần giữ lại

Backend TypeScript production là kiến trúc module và boundary. NestJS giúp bạn diễn đạt boundary đó bằng module, controller, service, provider, pipe và interceptor. Khi đọc backend lớn, hãy bắt đầu từ `main.ts`, sau đó đọc `AppModule`, rồi đi vào từng feature module.
