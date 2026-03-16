# 배포 플로우

PR Merge 버튼 클릭 후 전체 흐름을 정리한 문서.

## 전체 흐름

```
PR Merge 클릭
    │
    ▼
① GitHub가 dev → main으로 merge commit 생성
   (main 브랜치에 push 이벤트 발생)
    │
    ▼
② GitHub Actions 트리거 (on: push to main)
   Ubuntu 러너 머신 할당
    │
    ▼
③ Checkout — main 브랜치 소스코드를 러너에 clone
    │
    ▼
④ Setup Node.js 22 + npm 캐시 복원
   (이전 빌드의 ~/.npm 캐시가 있으면 재사용 → npm ci 빨라짐)
    │
    ▼
⑤ .env.production 파일 생성
   GitHub Secrets에서 4개 변수를 꺼내서 파일에 기록:
   - NOTION_SECRET_KEY        → /old 페이지 책 데이터 (서버사이드)
   - NOTION_BOOK_DATABASE_ID  → /old 페이지 책 DB ID (서버사이드)
   - NEXT_PUBLIC_HASHTAG_API_URL → 인스타그램 API (클라이언트)
   - NEXT_PUBLIC_GAMES_API_URL   → 게임 API (클라이언트)
    │
    ▼
⑥ npm ci — package-lock.json 기준으로 의존성 설치
    │
    ▼
⑦ npm run build (= next build)
   - next.config.mjs에 output: 'export', trailingSlash: true 설정
   - 모든 페이지를 정적 HTML로 생성 (SSG)
   - /old 페이지: Notion API 호출해서 책 데이터 fetch → HTML에 포함
   - /blog/[slug]: 모든 블로그 글을 정적 생성
   - NEXT_PUBLIC_* 변수는 빌드 시 JS 번들에 하드코딩됨
   - 결과물 → out/ 디렉토리에 HTML/CSS/JS 파일들
    │
    ▼
⑧ S3 기존 파일 전체 삭제
   aws s3 rm s3://kyu-niverse.com --recursive
    │
    ▼
⑨ S3에 out/ 디렉토리 업로드
   aws s3 cp --recursive out s3://kyu-niverse.com
    │
    ▼
⑩ CloudFront 캐시 무효화 (/* 전체)
   → 엣지 서버에 캐시된 이전 버전 파일 제거
   → 다음 요청부터 S3의 새 파일을 가져감
    │
    ▼
⑪ Slack 알림
   - 성공 시: webhook.sh로 "성공" 전송
   - 실패 시: 어느 스텝에서든 실패하면 "실패" 전송
```

## 인프라 구성

```
브라우저 → CloudFront (CDN) → S3 (정적 파일)
```

- 서버 없음 — 전부 정적 파일(HTML/JS/CSS)이라 S3에서 바로 서빙
- CloudFront 캐시 정책: Managed-CachingOptimized (Default TTL 24시간)

## 환경변수 구분

| 변수 | 용도 | 빌드 시 동작 |
|------|------|-------------|
| `NOTION_SECRET_KEY` | Notion API 인증 | 빌드 시 API 호출에 사용, 결과가 HTML에 포함 |
| `NOTION_BOOK_DATABASE_ID` | Notion DB 조회 | 빌드 시 API 호출에 사용, 결과가 HTML에 포함 |
| `NEXT_PUBLIC_HASHTAG_API_URL` | 인스타그램 API base URL | 빌드 시 JS 번들에 하드코딩 |
| `NEXT_PUBLIC_GAMES_API_URL` | 게임 API base URL | 빌드 시 JS 번들에 하드코딩 |

## 참고

- S3 삭제 → 업로드 사이에 짧은 다운타임이 있을 수 있음
- `trailingSlash: true` 설정으로 서브경로(`/old/`, `/blog/slug/`) 접근 가능
