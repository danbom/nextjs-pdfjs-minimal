'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// react-pdf README가 명시하는 두 가지
//  1) workerSrc 는 컴포넌트를 쓰는 "같은 모듈"에서 설정해야 합니다.
//     다른 파일에서 설정하면 기본값이 덮어쓸 수 있습니다.
//  2) public/ 에 워커를 복사하지 않습니다. new URL(..., import.meta.url) 로
//     번들러가 직접 해석하게 두면 pdfjs-dist 버전과 워커 버전이 어긋날 일이 없어요.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// 텍스트/주석 레이어를 쓸 때만 필요합니다. 안 쓰면 콘솔 경고가 뜹니다.
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

type Status = 'loading' | 'ready' | 'error'

export default function PdfViewer() {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  return (
    <>
      <div className="panel">
        <div className="row">
          <strong>상태</strong>
          {status === 'loading' && <span>불러오는 중…</span>}
          {status === 'ready' && (
            <span className="ok">
              ✓ 워커 로드 성공 · {numPages}쪽
            </span>
          )}
          {status === 'error' && <span className="bad">✕ {message}</span>}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <span>워커 경로</span>
          <code>{String(pdfjs.GlobalWorkerOptions.workerSrc)}</code>
        </div>
        <div className="row" style={{ marginTop: 6 }}>
          <span>pdfjs-dist</span>
          <code>{pdfjs.version}</code>
        </div>
      </div>

      <div className="panel">
        <div className="row">
          <button
            onClick={() => setPageNumber((n) => Math.max(1, n - 1))}
            disabled={pageNumber <= 1}
          >
            이전
          </button>
          <span>
            {pageNumber} / {numPages || '-'}
          </span>
          <button
            onClick={() => setPageNumber((n) => Math.min(numPages, n + 1))}
            disabled={!numPages || pageNumber >= numPages}
          >
            다음
          </button>
        </div>
      </div>

      <div className="doc">
        <Document
          file="/sample.pdf"
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
            setStatus('ready')
          }}
          onLoadError={(e) => {
            setStatus('error')
            setMessage(e.message)
          }}
          loading="PDF 여는 중…"
        >
          <Page pageNumber={pageNumber} width={720} />
        </Document>
      </div>
    </>
  )
}
