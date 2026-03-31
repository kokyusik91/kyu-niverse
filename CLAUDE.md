# KYU-NIVERSE

윈도우 OS 데스크톱 메타포를 활용한 인터랙티브 개인 포트폴리오 + 블로그 사이트.

## 스택

- Next.js 14 (App Router, `output: 'export'` 정적 빌드)
- TypeScript, Tailwind CSS v4, shadcn/ui (Radix UI)
- Three.js + React Three Fiber (3D 서점)
- MDX (next-mdx-remote + gray-matter + Shiki)
- Notion API, TanStack React Query 5
- 배포: GitHub Actions → S3 + CloudFront

## 핵심 구조

- `app/page.tsx` — 루트 = Neo 데스크톱 (빌드타임 데이터 페치)
- `app/neo/` — 메인 데스크톱 UI (WindowManager Context 기반)
- `app/old/` — Legacy 그리드 카드 테마 (/old 경로)
- `app/blog/[slug]/` — 블로그 SEO 풀페이지
- `content/blog/` — MDX 블로그 글 (39개)
- `scripts/publish-blog.mjs` — Obsidian → MDX 변환 스크립트
- `.claude/rules/` — 코딩 가이드라인 (응집도, 컴포넌트 설계, 예측성, 가독성)

## 규칙

- 정적 빌드 제약: API Routes, SSR, ISR, Middleware, Parallel/Intercepting Routes 사용 불가
- S3 호스팅: `trailingSlash: true` 필수
- MDX 내 HTML 태그는 JSX 규칙 준수 (셀프클로징)
- 환경변수: Notion API 키 필요 (빌드타임 책 데이터 페치)

## 현재 상태

- Neo 데스크톱 UI 동작 중 (블로그, Instagram, 게임, GitHub, 포스트잇 윈도우)
- 익명 포스트잇 게시판 구현 완료
  - `app/neo/components/postit/PostItContent.tsx` — 윈도우 콘텐츠
  - `app/test/postit-neo/` — 프로토타입 (독립 테스트용)
  - `lib/supabase.ts` — Supabase 클라이언트 + PostItNote 타입
  - Supabase: post_it_notes 테이블 + avatars 버킷 + RLS 검증 강화
  - 기능: CRUD, 랜덤 아바타, fingerprint 중복 방지, 체험용 로컬 모드, confetti, toast
- 알림 UI: embla-carousel 캐러셀 (뮤직 플레이어 홍보 + 포스트잇 안내 + 리뉴얼 안내)
- 모바일 뷰 구현 완료 (홈 런처, 블로그 리스트/상세, Instagram, 게임, 알림)
  - `app/neo/components/mobile/` — 모바일 전용 컴포넌트 (7개)
  - `app/neo/hooks/useIsMobile.ts` — 뷰포트 기반 분기 (768px)
  - `NeoDesktop.tsx`에서 `useIsMobile`로 모바일/데스크톱 분기
- 플로팅 뮤직 플레이어 구현 (바탕화면 우측 하단)
  - `app/neo/components/MusicPlayer.tsx` — 플로팅 버튼 + 미니 플레이어 패널
  - `public/Neon Tears.mp3`, `public/Dawn Blue.mp3` — 음원 파일 (2곡)
  - 기능: 재생/일시정지, 이전곡/다음곡, 셔플, 프로그레스 바 시크, 시간 표시, 커버 영역, 접이식 플레이리스트
- 이력서/서점 윈도우는 컴포넌트 준비됨, 콘텐츠 미완성 (WindowManager.tsx TODO)
- Playground: Flight Radar 지도 뷰 구현 완료
  - `app/neo/components/playground/FlightRadarMap.tsx` — Leaflet 지도 + 보간 마커
  - react-leaflet v4 + CartoDB Light 타일, lazy loading
  - 헤더 리스트/지도 뷰 토글, 마커 클릭 → 상세 다이얼로그 연동
- Anime 윈도우 구현 완료 (바탕화면 아이콘 등록)
  - `app/neo/components/anime/` — 12개 파일 (Content, ListView, DetailView, CharactersView, RelationshipGraph, 카드 2종, 다이얼로그 2종, api, types, icon)
  - 헤더 탭 토글 (애니 | 캐릭터), 윈도우 내부 뷰 전환 (list ↔ detail)
  - vis-network: Arc별 캐릭터 관계도
  - 환경변수: `NEXT_PUBLIC_KYUNO_API_URL` (kyuno-database API)
- Game Hub v2 구현 완료 (기존 games/ 대체)
  - `app/neo/components/games-v2/` — 8개 파일 (GamesV2Content, StatCards, UpcomingSection, MyGamesSection, RankingsSection, DealsSection, api, types)
  - 섹션 순서: Stats → Upcoming PS5 → My Games → Hot Games → Deals
  - API: `/api/games`, `/api/games/stats`, `/api/games/rankings`, `/api/games/deals`, `/api/games/upcoming`
  - 환경변수: `NEXT_PUBLIC_KYUNO_API_URL` (kyuno-database API, Anime과 공유)
- 다음 작업: 콘텐츠 채우기 (이력서, 포트폴리오, FE World 등)

## 프로젝트 문서

`~/Documents/kyuno-second-brain/10_Projects/kyu-niverse-site/`
