---
title: 2.1 Install, build và run một project TypeScript
---

# 2.1 Install, build và run một project TypeScript

Với Python, bạn thường bắt đầu bằng `python -m venv`, `pip install`, rồi chạy script hoặc notebook. Với TypeScript, điểm vào thường là `package.json`. File này vừa là metadata, vừa là danh sách dependencies, vừa là bảng điều khiển các command của project.

Một project TypeScript có thể là frontend, backend, package, CLI hoặc monorepo. Nhưng quy trình cơ bản thường có cùng nhịp: cài runtime, cài package manager, cài dependencies, cấu hình environment, chạy dev server, build, test, rồi chạy production output.

## Bước 1: cài Node.js

Node.js là runtime JavaScript phía server. TypeScript cuối cùng compile về JavaScript để chạy trên Node hoặc browser. Với project mới, nên dùng Node LTS hoặc version mà repo yêu cầu. Docmost Dockerfile dùng `node:22-slim`, nên nếu nghiên cứu Docmost từ source, Node 22 là lựa chọn hợp lý.

Kiểm tra:

```bash
node --version
npm --version
```

Nếu bạn dùng nhiều project, nên dùng `nvm`, `fnm` hoặc một version manager tương tự để chuyển Node version.

## Bước 2: cài package manager

JavaScript ecosystem có nhiều package manager: npm, yarn và pnpm. Docmost khai báo:

```json
"packageManager": "pnpm@10.4.0"
```

Điều này nói rằng project kỳ vọng dùng pnpm version 10.4.0. Nếu dùng Node mới, bạn có thể dùng Corepack:

```bash
corepack enable
corepack prepare pnpm@10.4.0 --activate
pnpm --version
```

## Bước 3: install dependencies

Trong repo có `pnpm-lock.yaml`, nên khi cài đặt cần ưu tiên lockfile:

```bash
pnpm install --frozen-lockfile
```

`--frozen-lockfile` tương đương tinh thần reproducible environment. Nó nói rằng package manager không được tự ý sửa lockfile. Nếu lockfile và `package.json` lệch nhau, command fail thay vì âm thầm cập nhật dependency tree.

## Bước 4: đọc scripts

Trong `package.json`, Docmost có các scripts quan trọng:

```json
{
  "build": "nx run-many -t build",
  "dev": "pnpm concurrently -n \"frontend,backend\" -c \"cyan,green\" \"pnpm run client:dev\" \"pnpm run server:dev\"",
  "client:dev": "nx run client:dev",
  "server:dev": "nx run server:start:dev",
  "start": "pnpm --filter ./apps/server run start:prod"
}
```

Đọc theo nghĩa đời thường: `pnpm run dev` chạy frontend và backend cùng lúc. `pnpm run build` build nhiều project qua Nx. `pnpm start` chạy server production từ output đã build.

## Bước 5: cấu hình environment

Project production hiếm khi chạy chỉ bằng code. Nó cần biến môi trường. Docmost có `.env.example` với các biến như:

```bash
APP_URL=http://localhost:3000
APP_SECRET=REPLACE_WITH_LONG_SECRET
DATABASE_URL="postgresql://postgres:password@localhost:5432/docmost?schema=public"
REDIS_URL=redis://127.0.0.1:6379
STORAGE_DRIVER=local
```

Với local development, bạn thường làm:

```bash
cp .env.example .env
```

Sau đó sửa `APP_SECRET`, `DATABASE_URL`, `REDIS_URL` theo database và Redis local.

## Bước 6: chạy dev

Với Docmost, quy trình source development thường là:

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

Command trên giả định bạn dùng Docker Compose để chạy PostgreSQL và Redis, còn app chạy từ source. Nếu bạn chỉ muốn trải nghiệm sản phẩm mà không nghiên cứu code, cách nhanh hơn là chạy toàn bộ Docker Compose.

## Bước 7: build và run production

Build:

```bash
pnpm run build
```

Run production:

```bash
pnpm start
```

Trong Dockerfile của Docmost, build stage chạy `pnpm install --frozen-lockfile` rồi `pnpm build`. Runtime stage chỉ copy output cần thiết, cài production dependencies và chạy:

```bash
pnpm start
```

Đây là pattern phổ biến: build đầy đủ ở một stage, runtime gọn hơn ở stage cuối.

## Điều cần giữ lại

Muốn chạy project TypeScript, đừng đoán entry point bằng mắt. Hãy đọc theo thứ tự: `package.json`, lockfile, package manager, `tsconfig`, framework config, `.env.example`, Dockerfile và README. Với người từ Python, `package.json` nên được xem như `pyproject.toml`, `Makefile` và một phần documentation gộp lại.
