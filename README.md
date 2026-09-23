# Next.js × pdf.js 최소 재현

`react-pdf`(pdf.js)를 **Next.js App Router + Turbopack**에서 띄울 때, 검색해서 나오는 설정들이
지금도 필요한지 확인하는 최소 예제입니다.

## 결론 먼저

`next.config.ts`는 **비어 있습니다.** 그리고 그걸로 충분합니다 — **딱 하나만 빼고요.**

| 흔한 처방 | 지금도 필요한가 |
|---|---|
| `swcMinify: false` | ❌ 불필요 |
| `resolve.alias.canvas = false` | ❌ 불필요 |
| 워커를 `public/`에 복사 | ❌ 불필요 (Turbopack이 번들함) |
| **`next/dynamic` + `ssr: false`** | ✅ **지금도 필요** |

## 확인한 조합

```
Next.js     16.3.6 (Turbopack)
pdfjs-dist  5.4.296
react-pdf   10.x
```

## 실행

```bash
npm install
npm run dev
```

## 두 경로를 비교하세요

| 경로 | 무엇 | 예상 |
|---|---|---|
| `/` | 감싸지 않은 뷰어 | **실패** — 500 · `DOMMatrix is not defined` |
| `/ssr-skipped` | `ssr:false`로 감싼 뷰어 | **성공** — 콘솔 깨끗 |

`/`가 실패하는 것은 **의도된 재현**입니다. 고쳐야 할 버그가 아닙니다.

### `/` 에서 보게 되는 것

```
ReferenceError: DOMMatrix is not defined
app/pdf-viewer.tsx (4:1) @ module evaluation
> 4 | import { Document, Page, pdfjs } from 'react-pdf'

  .next/dev/server/chunks/ssr/node_modules_...
```

`npm run build` 를 돌리면 더 선명합니다.

```
Warning: Please use the `legacy` build in Node.js environments.
Error occurred prerendering page "/"
ReferenceError: DOMMatrix is not defined
    at module evaluation (webpack://pdf.js/src/display/canvas.js:63:22)
> 63 | const SCALE_MATRIX = new DOMMatrix();
Export encountered an error on /page: /, exiting the build.
```

`DOMMatrix`는 브라우저 API인데 pdf.js가 **모듈 최상단**에서 인스턴스를 하나 만들어 둡니다.
함수 안이 아니라 최상단이라 `import` 되는 순간 실행되고, App Router의 `'use client'`
컴포넌트도 서버에서 한 번 렌더되므로 여기서 터집니다.

## 확인 항목

| # | 확인 | 통과 기준 |
|---|---|---|
| 1 | `/ssr-skipped` 가 뜨는가 | 상태에 **✓ 워커 로드 성공 · 2쪽** |
| 2 | 워커 경로 | `/_next/static/media/pdf.worker.min.*.mjs` — `public/`을 안 썼는데도 |
| 3 | `Setting up fake worker` 경고 | 없어야 정상 |
| 4 | `Can't resolve 'canvas'` | 없어야 정상 |
| 5 | `/` 가 500인가 | `DOMMatrix is not defined` |
| 6 | `npm run build` | `/` 에서 실패 (의도됨) |

```bash
npm run versions   # next / react / react-pdf / pdfjs-dist
npm run dev:webpack  # webpack 과 비교
```

## workerSrc를 이렇게 쓰는 이유

```ts
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()
```

- **`public/`에 복사하지 않습니다.** 복사하면 `pdfjs-dist`를 올릴 때 워커만 옛 버전으로 남아
  `API version … does not match Worker version …` 로 터집니다.
- **CDN 주소를 쓰지 않습니다.** 사내망·오프라인에서 죽고 버전 고정도 사람이 해야 합니다.
- **컴포넌트를 쓰는 같은 모듈에서 설정합니다.** react-pdf README가 명시하는 조건입니다.

## 구조

```
app/
  page.tsx              /            감싸지 않음 — 실패 재현
  ssr-skipped/page.tsx  /ssr-skipped ssr:false — 정상 동작
  pdf-viewer.tsx        'use client' + workerSrc를 같은 모듈에서 설정
  icon.png
public/sample.pdf       2쪽짜리 최소 PDF (외부 의존 없이 생성)
next.config.ts          비어 있음
```

## 참고 이슈 (모두 종료됨)

검색하면 여전히 상단에 나옵니다. 읽을 때 날짜를 보세요.

- vercel/next.js [#64165](https://github.com/vercel/next.js/issues/64165) · [#64657](https://github.com/vercel/next.js/issues/64657)
- wojtekmaj/react-pdf [#1856](https://github.com/wojtekmaj/react-pdf/issues/1856) · [discussion #1688](https://github.com/wojtekmaj/react-pdf/discussions/1688)

## 라이선스

MIT
