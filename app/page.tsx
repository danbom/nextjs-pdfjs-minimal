import PdfViewer from './pdf-viewer'

export default function Page() {
  return (
    <main>
      <h1>Next.js × pdf.js 최소 재현</h1>
      <p className="sub">
        <code>next.config.ts</code>는 비어 있습니다. Turbopack으로 <code>npm run dev</code> 했을 때
        아래 문서가 보이면 추가 설정이 필요 없다는 뜻이에요.
      </p>
      <PdfViewer />
    </main>
  )
}
