# /old 경로가 production에서 루트로 리다이렉트되는 문제

## 현상

- localhost: `/old` 정상 접근
- production (S3 + CloudFront): `/old` 접근 시 루트(`/`)로 리다이렉트

## 원인

### Next.js static export의 파일 생성 방식

`trailingSlash` 미설정(기본값 `false`) 시 Next.js는 아래와 같이 파일을 생성한다:

```
out/
├── index.html      ← /
├── old.html        ← /old
└── blog/
    └── slug.html   ← /blog/slug
```

### localhost vs production 차이

| 환경 | `/old` 요청 시 동작 |
|------|---------------------|
| localhost (`next dev`) | Next.js 개발 서버가 라우팅 처리 → 정상 |
| S3 + CloudFront | `old`라는 키(파일)를 찾음 → 없음 → **404** |

S3는 파일 기반 스토리지라 `/old` 요청이 들어오면 `old`라는 정확한 키를 찾는다. `old.html`이 있어도 확장자 없이는 매칭되지 않는다.

### 루트로 리다이렉트된 이유

CloudFront에 커스텀 에러 응답이 설정되어 있어 404 발생 시 `/index.html`을 반환한다. 그래서 404가 아닌 루트 페이지가 보였던 것.

```
브라우저 → /old 요청
    → CloudFront → S3에서 "old" 키 조회 → 404
    → CloudFront 커스텀 에러 응답 → /index.html 반환
    → 루트 페이지가 렌더링됨
```

## 해결

`next.config.mjs`에 `trailingSlash: true` 추가.

```js
const nextConfig = {
  output: 'export',
  trailingSlash: true,  // 추가
  images: {
    unoptimized: true,
  },
};
```

이 설정으로 빌드 결과물이 디렉토리 + `index.html` 구조로 변경된다:

```
out/
├── index.html          ← /
├── old/
│   └── index.html      ← /old/
└── blog/
    └── slug/
        └── index.html  ← /blog/slug/
```

S3는 디렉토리 접근 시 `index.html`을 자동으로 반환하므로 `/old/` 경로가 정상 동작한다.
