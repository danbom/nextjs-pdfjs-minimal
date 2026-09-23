'use client'

import dynamic from 'next/dynamic'

// 비교용 경로입니다.
//
// 오래된 안내문들은 react-pdf를 반드시 ssr:false 로 감싸라고 합니다.
// 정말 필요한지 확인하려고 같은 뷰어를 이 방식으로도 띄워 둡니다.
// 두 경로가 똑같이 동작하면, / 쪽(감싸지 않은 쪽)이 정답입니다.
const PdfViewer = dynamic(() => import('../pdf-viewer'), {
  ssr: false,
  loading: () => <p>뷰어 불러오는 중…</p>,
})

export default function Page() {
  return (
    <main>
      <h1>비교 — next/dynamic ssr:false</h1>
      <p className="sub">
        같은 뷰어를 <code>ssr:false</code>로 감싼 경우입니다. <a href="/">기본 경로</a>와 비교해 보세요.
      </p>
      <PdfViewer />
    </main>
  )
}
