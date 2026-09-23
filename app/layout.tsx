import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js × pdf.js 최소 재현',
  description: 'react-pdf를 Turbopack에서 설정 없이 띄우는 최소 예제',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
