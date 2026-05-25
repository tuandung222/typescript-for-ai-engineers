---
title: 5.3 Testing, lint, format và review
---

# 5.3 Testing, lint, format và review

TypeScript compiler bắt được nhiều lỗi, nhưng không bắt hết. Compiler không biết business logic đúng hay sai. Nó không biết permission model có lỗ hổng không. Nó không biết model provider retry policy có gây double charge không. Vì vậy một project TypeScript nghiêm túc cần nhiều lớp quality gate.

## Typecheck

Typecheck trả lời câu hỏi: code có nhất quán về type không? Với frontend Vite, build script thường chạy `tsc` rồi `vite build`. Với backend NestJS, build chạy TypeScript compiler qua Nest CLI.

Trong CI, nên có command riêng:

```bash
npm run typecheck
```

hoặc trong monorepo:

```bash
pnpm run typecheck
```

Nếu project chưa có script riêng, build có thể bao gồm typecheck, nhưng tách riêng vẫn tốt cho feedback nhanh.

## Lint

Lint trả lời câu hỏi: code có vi phạm rule style hoặc rule an toàn không? ESLint có thể bắt unused variables, floating promises, import order, React hooks rules và nhiều pattern nguy hiểm.

Với TypeScript, lint tốt không chỉ là format. Nó có thể ngăn `any`, ép xử lý promise, cấm import sai boundary và bảo vệ React hooks.

## Format

Format trả lời câu hỏi: code có một style trình bày thống nhất không? Prettier thường xử lý format. Team không nên tranh luận thủ công về indent, quote hoặc line break trong review. Tool nên quyết định.

## Test

Có nhiều lớp test:

- **Unit test:** kiểm tra function hoặc service nhỏ.
- **Integration test:** kiểm tra module với database, Redis hoặc external boundary giả lập.
- **E2E test:** kiểm tra route hoặc user flow.
- **Contract test:** kiểm tra frontend và backend không lệch API.
- **Regression test:** giữ lỗi đã sửa không quay lại.

Docmost server dùng Jest. Client dùng Vitest. Đây là pattern phổ biến: backend Node dùng Jest, frontend Vite dùng Vitest.

## Code review checklist

Khi review TypeScript code, đừng chỉ hỏi code chạy không. Hãy hỏi:

- Type ở boundary có rõ không?
- Có dùng `any` không cần thiết không?
- Dữ liệu ngoài có được validate không?
- Error path có được xử lý không?
- Async call có bị quên `await` không?
- Module boundary có bị phá không?
- Test có cover nhánh quan trọng không?
- API change có ảnh hưởng frontend hoặc SDK không?
- Config hoặc secret có bị lộ ra frontend không?
- Logging có đủ context nhưng không lộ dữ liệu nhạy cảm không?

## CI là người gác cổng

Một repo tốt nên có CI chạy tối thiểu:

```bash
npm run verify
```

Trong đó `verify` có thể gồm QA docs, typecheck, lint, test và build. Với monorepo lớn, CI nên tận dụng cache và affected build để không chạy mọi thứ quá chậm.

## Điều cần giữ lại

Compiler là một lớp bảo vệ, không phải toàn bộ quality system. TypeScript project production cần typecheck, lint, format, test, build và review convention. Với AI systems, hãy thêm evals và safety checks như một phần của quality gate.
