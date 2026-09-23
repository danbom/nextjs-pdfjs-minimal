import type { NextConfig } from 'next'

// 이 파일이 이 저장소의 핵심입니다.
//
// 인터넷에 도는 pdf.js × Next.js 안내문 대부분은 여기에 무언가를 넣으라고 합니다.
//   - swcMinify: false
//   - webpack: (config) => { config.resolve.alias.canvas = false; return config }
//   - turbopack.resolveAlias 로 canvas 를 빈 모듈로 보내기
//
// react-pdf v9.2.0(PDF.js 4.8.69) 이후로는 셋 다 필요 없습니다.
// 릴리스 노트 원문: "significantly simplifying setup in Next.js.
//                   You no longer need to do any changes to Next.js config!"
//
// 그래서 이 설정은 비어 있습니다. 비어 있는 것이 결과입니다.
const nextConfig: NextConfig = {}

export default nextConfig
