---
title: 7.2 Cài đặt, build và chạy Gemini CLI
---

# 7.2 Cài đặt, build và chạy Gemini CLI

Ở bài trước, bạn đã thấy bản đồ kiến trúc. Bài này đi sâu vào build pipeline  -  cách Gemini CLI chuyển từ source `.ts` thành single file `bundle/gemini.js` mà `npx @google/gemini-cli` chạy được. Hiểu pipeline này giúp bạn biết cách một production TypeScript CLI được build, test và distribute.

## Cài đặt dependency

```bash
git clone https://github.com/google-gemini/gemini-cli.git
cd gemini-cli
npm ci
```

`npm ci` (clean install) đọc `package-lock.json` và install chính xác version được lock. Vì root dùng `"workspaces": ["packages/*"]`, npm tự động resolve và symlink các package nội bộ. Sau `npm ci`, `packages/cli` có thể import `@google/gemini-cli-core` và trỏ tới `packages/core` trên disk.

Yêu cầu Node.js >= 20 (định nghĩa trong `"engines"` của root `package.json`).

## Build pipeline

### Bước 1: Build từng package

```bash
npm run build
```

Lệnh này chạy `node scripts/build.js`. Script build từng workspace theo thứ tự dependency: `core` trước (vì `cli`, `sdk`, `a2a-server` phụ thuộc nó), sau đó các package còn lại. Mỗi package có script `"build": "node ../../scripts/build_package.js"` gọi chung một build script. Output của mỗi package nằm ở `dist/` trong package đó (ví dụ `packages/core/dist/`).

Build script dùng `tsc` (TypeScript compiler) để compile `.ts` và `.tsx` thành `.js` + `.d.ts`. Vì `"composite": true` và `"incremental": true` trong tsconfig, TypeScript cache build info (`.tsbuildinfo`) và chỉ compile lại file thay đổi.

### Bước 2: Bundle thành single file

```bash
npm run bundle
```

Đây là bước quan trọng nhất. `npm run bundle` thực hiện:

1. `npm run generate`  -  generate file chứa git commit info
2. Build devtools package
3. Bundle browser-mcp cho core
4. **`node esbuild.config.js`**  -  bundle chính

File `esbuild.config.js` (187 dòng) định nghĩa 3 build config:

```javascript
// CLI bundle  -  sản phẩm chính
const cliConfig = {
  ...baseConfig,
  entryPoints: { gemini: 'packages/cli/index.ts' },
  outdir: 'bundle',
  splitting: true,    // Code splitting cho shared chunks
  define: {
    'process.env.CLI_VERSION': JSON.stringify(pkg.version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: createWasmPlugins(),  // WASM plugin cho tree-sitter
};
```

**Điểm đáng chú ý:**

- **Entry point**: `packages/cli/index.ts` → `bundle/gemini.js`
- **Format**: ESM (`format: 'esm'`), platform `node`
- **Code splitting**: `splitting: true` tạo shared chunk, giảm duplication
- **External packages**: `node-pty` variants và `@github/keytar` được exclude vì là native addon
- **WASM plugin**: tree-sitter (parser cho code analysis) dùng WebAssembly, cần `esbuild-plugin-wasm`
- **Banner injection**: inject polyfill cho `require`, `__filename`, `__dirname` trong ESM context

```javascript
const baseConfig = {
  bundle: true,
  platform: 'node',
  format: 'esm',
  external,
  loader: { '.node': 'file' },
  write: true,
};
```

Ngoài CLI bundle, còn có worker bundle (cho Ink rendering) và a2a-server bundle. Ba bundle chạy song song:

```javascript
Promise.allSettled([
  esbuild.build(cliConfig),
  esbuild.build(workerConfig),
  esbuild.build(a2aServerConfig),
]).then((results) => { /* ... */ });
```

### Bước 3: Output

Output cuối cùng nằm ở `bundle/gemini.js`. Root `package.json` định nghĩa:

```json
{
  "bin": { "gemini": "bundle/gemini.js" },
  "files": ["bundle/", "README.md", "LICENSE"]
}
```

Khi publish lên npm, chỉ có `bundle/` được include. Người dùng `npx @google/gemini-cli` chạy đúng 1 file JavaScript duy nhất. Đây là pattern phổ biến cho CLI tool: source nhiều package, build thành single artifact.

## So sánh Docmost và Gemini CLI build

| | Docmost | Gemini CLI |
|---|---------|------------|
| **Build tool** | Nx + Vite + NestJS CLI | esbuild |
| **Output** | Docker image (client + server) | `bundle/gemini.js` (single file) |
| **Distribution** | Docker pull | `npx @google/gemini-cli` |
| **Workspace tool** | pnpm + Nx | npm workspaces |
| **Incremental** | Nx caching | TypeScript `composite` + `incremental` |
| **Runtime** | Node server + browser | Node CLI |

## Chạy development

```bash
npm run start           # Development mode (NODE_ENV=development)
npm run start:prod      # Production mode
npm run debug           # Debug mode với --inspect-brk
```

`scripts/start.js` chạy `bundle/gemini.js` sau khi build. Trong development, bạn có thể dùng `npm run build-and-start` để build rồi chạy trong 1 lệnh.

## Testing

```bash
npm run test            # Unit tests (vitest) trên tất cả workspace
npm run test:ci         # CI mode (không watch)
npm run test:integration:sandbox:none   # Integration test không sandbox
npm run test:integration:sandbox:docker # Integration test với Docker sandbox
npm run test:perf       # Performance test
npm run test:memory     # Memory test
```

Gemini CLI dùng **vitest** cho tất cả test. Vitest chạy ESM native, phù hợp với project ESM-only. Integration test có 3 chế độ sandbox: `none` (không isolate), `docker` và `podman`, cho phép test tool execution trong môi trường controlled.

## Type checking

```bash
npm run typecheck
```

Lệnh này chạy `tsc --noEmit` trên mỗi workspace và thêm `tsc -b` cho `evals/`, `integration-tests/` và `memory-tests/`. `--noEmit` nghĩa là chỉ check type, không tạo output file (vì build thực đã được `npm run build` lo). Typecheck chạy trên CI cùng với lint:

```bash
npm run lint            # ESLint với --max-warnings 0 (zero tolerance)
npm run format          # Prettier
```

## Pre-flight check

```bash
npm run preflight
```

Đây là lệnh chạy trước khi commit hoặc release: clean → ci → format → build → lint → typecheck → test. Nếu `preflight` pass, code sẵn sàng merge.

## Điều cần giữ lại

Build pipeline của Gemini CLI cho thấy một pattern quan trọng cho AI engineer: **monorepo nhiều package nhưng distribute dưới dạng single artifact**. `esbuild` bundle mọi thứ thành 1 file, giúp `npx` chạy instant mà không cần install dependency tree. Khi bạn build AI tool hoặc AI agent CLI, pattern này (esbuild + ESM + code splitting) là reference tốt. Trong bài tiếp theo, ta sẽ đọc sâu vào agent loop  -  phần logic trung tâm mà mọi thứ khác wrap quanh.
