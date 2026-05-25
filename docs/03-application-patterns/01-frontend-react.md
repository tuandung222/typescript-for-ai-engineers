---
title: 3.1 Frontend TypeScript với React và Vite
---

# 3.1 Frontend TypeScript với React và Vite

Frontend TypeScript không chỉ là viết component có type. Một frontend production phải quản lý route, server state, local state, form, error boundary, accessibility, analytics, theme, i18n và build output. Khi nhìn vào `apps/client` của Docmost, ta thấy nhiều mảnh ghép này xuất hiện ngay ở entry point.

## Entry point của React app

Frontend Docmost có `apps/client/src/main.tsx`. File này import CSS, tạo `QueryClient`, cấu hình provider và render `App` vào DOM. Đọc entry point là cách nhanh nhất để biết frontend phụ thuộc những global context nào.

Một entry point React thường trả lời các câu hỏi:

- App dùng router nào?
- App dùng design system nào?
- Server state được quản lý bởi React Query, Apollo hay cách khác?
- Có notification provider không?
- Có modal provider không?
- Analytics được bật trong điều kiện nào?
- Root component là gì?

Trong Docmost, ta thấy `BrowserRouter`, `MantineProvider`, `ModalsProvider`, `QueryClientProvider`, `HelmetProvider`, `PostHogProvider` và `Notifications`. Đây là dấu hiệu của một frontend ứng dụng thật, không phải demo component.

## Props và component contract

TypeScript giúp component contract rõ hơn. Ví dụ:

```tsx
type UserCardProps = {
  name: string;
  role?: string;
  onOpenProfile: () => void;
};

function UserCard({name, role, onOpenProfile}: UserCardProps) {
  return <button onClick={onOpenProfile}>{name} {role}</button>;
}
```

`role?: string` nghĩa là optional. `onOpenProfile` là callback không nhận tham số và không trả giá trị đáng quan tâm. Khi component lớn lên, props type giúp người dùng component biết cần truyền gì.

## Server state khác local state

Data scientist thường quen với biến trong notebook. Frontend production cần phân biệt local UI state và server state.

Local state là thứ như modal đang mở, tab nào đang active, input đang gõ. Server state là dữ liệu đến từ backend: user, workspace, documents, permissions, comments. React Query quản lý server state tốt vì nó xử lý cache, refetch, loading, error và stale time.

Docmost dùng `@tanstack/react-query`. Trong `main.tsx`, `QueryClient` được cấu hình với `refetchOnWindowFocus: false`, `retry: false`, `staleTime: 5 * 60 * 1000`. Đây là quyết định UX: không tự refetch khi focus lại window, không retry mặc định, và xem data còn fresh trong 5 phút.

## Type ở API boundary

Frontend có thể type response, nhưng response thật từ network vẫn là JSON. Nếu backend và frontend cùng repo, bạn có thể chia sẻ type hoặc sinh client từ schema. Nếu không, bạn cần runtime validation ở nơi phù hợp.

Một pattern tốt là không rải `axios.get` khắp component. Hãy gom API calls vào client layer:

```ts
type Page = {
  id: string;
  title: string;
};

async function listPages(spaceId: string): Promise<Page[]> {
  const response = await fetch(`/api/spaces/${spaceId}/pages`);
  if (!response.ok) {
    throw new Error('Failed to list pages');
  }
  return response.json() as Promise<Page[]>;
}
```

Trong production nghiêm túc, đoạn `as Promise<Page[]>` nên được thay hoặc bổ sung bằng schema validation nếu dữ liệu không đáng tin.

## Điều cần giữ lại

Frontend TypeScript là nơi type system gặp UX. Component props, API response, route params, form schema và error state đều cần contract rõ. Khi đọc một frontend lớn, hãy bắt đầu từ entry point, provider tree, routing, API client và state management.
