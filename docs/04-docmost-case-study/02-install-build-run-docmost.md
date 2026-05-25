---
title: 4.2 Install, build và run Docmost
---

# 4.2 Install, build và run Docmost

Có hai cách tiếp cận Docmost. Nếu bạn chỉ muốn chạy sản phẩm để xem tính năng, Docker Compose là đường ngắn. Nếu bạn muốn học TypeScript, kiến trúc và code, nên chạy từ source để thấy frontend, backend, database migration và dev server hoạt động thế nào.

## Cách 1: chạy bằng Docker Compose

Root `docker-compose.yml` của Docmost có ba service: `docmost`, `db` và `redis`.

```yaml
services:
  docmost:
    image: docmost/docmost:latest
    depends_on:
      - db
      - redis
    environment:
      APP_URL: 'http://localhost:3000'
      APP_SECRET: 'REPLACE_WITH_LONG_SECRET'
      DATABASE_URL: 'postgresql://docmost:STRONG_DB_PASSWORD@db:5432/docmost'
      REDIS_URL: 'redis://redis:6379'
    ports:
      - "3000:3000"
```

Đây là cách đọc: container app cần database và Redis. App lắng nghe port 3000. `DATABASE_URL` trỏ tới service `db` trong Docker network. `REDIS_URL` trỏ tới service `redis`.

Chạy:

```bash
docker compose up -d
```

Sau đó mở `http://localhost:3000`.

## Cách 2: chạy từ source để học code

Với mục tiêu học TypeScript, cách tốt hơn là chạy database và Redis bằng Docker, còn app chạy từ source.

```bash
git clone https://github.com/docmost/docmost.git
cd docmost
corepack enable
corepack prepare pnpm@10.4.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d db redis
pnpm --filter ./apps/server run migration:latest
pnpm run dev
```

Nếu port, user hoặc password database khác `.env.example`, bạn cần sửa `DATABASE_URL`. Nếu Redis không ở `127.0.0.1:6379`, sửa `REDIS_URL`.

## Build toàn bộ project

Root build script là:

```bash
pnpm run build
```

Nó gọi:

```bash
nx run-many -t build
```

Nx sẽ chạy build target cho các project liên quan. Với client, build thường là `tsc && vite build`. Với server, build là `nest build`. Với package nội bộ, build tùy package.

## Run production từ source build

Sau khi build:

```bash
pnpm start
```

Root script chạy:

```bash
pnpm --filter ./apps/server run start:prod
```

Server script chạy:

```bash
cross-env NODE_ENV=production node dist/main
```

Điều này nói rằng production backend chạy JavaScript output trong `apps/server/dist`. Client build output được phục vụ qua static integration hoặc được copy vào image tùy build setup.

## Đọc Dockerfile để hiểu production image

Dockerfile của Docmost dùng nhiều stage.

Stage `builder` cài dependencies và chạy `pnpm build`. Stage `installer` copy output đã build, package.json cần thiết, lockfile, patches, rồi chạy `pnpm install --frozen-lockfile --prod`. Cuối cùng image expose port 3000 và chạy `pnpm start`.

Pattern này dạy một bài học kiến trúc quan trọng: môi trường build và môi trường runtime nên tách nhau. Build cần TypeScript, bundler, dev dependencies. Runtime chỉ cần output và production dependencies.

## Lỗi thường gặp khi chạy TypeScript project

- **Sai Node version:** build fail vì syntax hoặc package yêu cầu Node mới hơn.
- **Sai package manager:** dùng npm trong repo pnpm có thể làm dependency tree lệch.
- **Không có database hoặc Redis:** backend boot fail dù TypeScript compile pass.
- **Thiếu `.env`:** app không có secret, database URL hoặc storage config.
- **Chưa chạy migration:** database tồn tại nhưng schema chưa đúng.
- **Port conflict:** port 3000 hoặc 5173 đã bị process khác dùng.

## Điều cần giữ lại

Install, build và run không chỉ là copy command. Bạn cần hiểu command đó đang điều phối runtime nào, service nào, output nào và config nào. Với TypeScript production app, toolchain và environment là một phần của kiến thức lập trình.
