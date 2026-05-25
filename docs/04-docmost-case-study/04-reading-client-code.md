---
title: 4.4 Đọc frontend Docmost
---

# 4.4 Đọc frontend Docmost

Frontend Docmost nằm trong `apps/client`. Nó dùng React, Vite, Mantine, React Query, React Router và nhiều package UI. Đây là ví dụ tốt để học cách một frontend TypeScript production được bootstrap và tổ chức quanh provider tree.

## Entry point: main.tsx

`apps/client/src/main.tsx` là cửa vào của frontend. Nó import CSS, tạo React root và render `App`.

Điều đáng chú ý là trước khi render `App`, code bọc app trong nhiều providers:

- `BrowserRouter` cho routing.
- `MantineProvider` cho theme và design system.
- `ModalsProvider` cho modal management.
- `QueryClientProvider` cho server state.
- `HelmetProvider` cho document head.
- `PostHogProvider` cho analytics trong điều kiện cloud.
- `Notifications` cho thông báo UI.

Provider tree chính là kiến trúc runtime của frontend. Nó cho biết component bên dưới được phép dùng context nào.

## QueryClient là policy cho server state

Docmost tạo `QueryClient` với options:

```ts
queries: {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: 5 * 60 * 1000,
}
```

Đây không chỉ là config kỹ thuật. Nó là policy UX và reliability. App không tự refetch khi user focus lại window. Query không retry mặc định. Data được xem là fresh trong 5 phút. Những quyết định này ảnh hưởng cảm giác sử dụng và tải backend.

Với AI apps, server state càng phức tạp: conversation, run status, streaming chunks, eval results, file uploads và tool events. Bạn cần policy rõ: khi nào refetch, khi nào retry, cache bao lâu, lỗi hiển thị thế nào.

## Import alias

Client `tsconfig.json` có:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Vì vậy code có thể import:

```ts
import {theme} from '@/theme';
```

thay vì relative path dài. Alias giúp code sạch hơn, nhưng nếu lạm dụng quá nhiều alias, người mới khó hiểu dependency boundary. Convention tốt là dùng ít alias và đặt tên rõ.

## Configuration ở frontend

Docmost chỉ bật PostHog khi `isCloud()` và config cho phép. Đây là pattern tốt: frontend config không nên hardcode. Nhưng cũng cần nhớ rằng mọi biến frontend đều có thể lộ ra browser. Không bao giờ đặt secret thật trong frontend bundle.

Với AI applications, frontend có thể biết model name public hoặc feature flag, nhưng không được giữ API key model provider. API key phải ở backend.

## Điều cần giữ lại

Đọc frontend TypeScript không nên bắt đầu từ component sâu nhất. Hãy đọc `main.tsx`, provider tree, router, API client, state management và theme trước. Với React app, kiến trúc thường nằm trong cách app được bọc bởi providers và cách dữ liệu đi từ server vào component.
