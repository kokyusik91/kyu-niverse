# Game API Reference

kyuno-database의 game 관련 공개 API 명세. 모든 엔드포인트는 GET만 제공하며 인증 불필요.

Base URL: 환경변수 `NEXT_PUBLIC_KYUNO_API_URL`로 설정

## 공통 응답 형식

```jsonc
// 리스트
{ "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }

// 단건
{ "data": { ... } }

// 에러
{ "error": "Not found" }  // 404
```

---

## 1. 내 게임 목록

### GET /api/games

플레이한 게임 목록 (playHours > 0만 반환).

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 게임명 검색 |
| rating | number | - | 내 평점 필터 |
| page | number | 1 | 페이지 |
| limit | number | 20 | 페이지 크기 |

```jsonc
// Response
{
  "data": [{
    "items_base": {
      "id": 5,
      "category": "game",
      "name": "SILENT HILL 2",
      "imageUrl": "https://media.rawg.io/media/games/...",
      "rating": null,        // 내 평점 (1-5, null이면 미평가)
      "memo": null,
      "createdAt": 1773564947,
      "updatedAt": 1773564947
    },
    "games": {
      "itemId": 5,
      "difficulty": null,
      "genre": ["Adventure", "Action"],
      "playHours": 1,        // 총 플레이 시간
      "platform": "PS5",
      "metacritic": null,    // 메타크리틱 점수
      "releasedAt": "2024-10-08"
    }
  }],
  "meta": { "total": 28, "page": 1, "limit": 20 }
}
```

---

## 2. 게임 상세

### GET /api/games/:id

ID로 게임 상세 조회. playHours가 0인 게임도 조회 가능.

```jsonc
// Response
{
  "data": {
    "items_base": { /* 위와 동일 */ },
    "games": { /* 위와 동일 */ }
  }
}
```

---

## 3. Dashboard 통계

### GET /api/games/stats

플레이한 게임 기준 통계 (playHours > 0).

```jsonc
// Response
{
  "data": {
    "totalGames": 28,          // 총 게임 수
    "totalPlayHours": 339,     // 총 플레이 시간
    "avgMetacritic": 83,       // 평균 메타크리틱 점수
    "mostPlayed": {            // 최다 플레이 게임
      "name": "Monster Hunter Wilds",
      "playHours": 92,
      "imageUrl": "https://media.rawg.io/media/games/..."
    }
  }
}
```

---

## 4. 인기 게임 랭킹 (Hot Games Top 20)

### GET /api/games/rankings

RAWG API 기반 최근 2년 인기 게임 Top 20. 위시리스트/라이브러리 추가 수(`added`) 기준 정렬.

```jsonc
// Response
{
  "data": [{
    "id": 1,
    "rank": 1,
    "rawgId": 872124,
    "name": "Vampire: The Masquerade – Bloodlines 2",
    "added": 2455,             // 위시리스트/라이브러리 추가 수 (인기 지표)
    "rating": "3.84",          // RAWG 유저 평점 (5점 만점)
    "metacritic": null,        // 메타크리틱 점수 (없을 수 있음)
    "genre": ["RPG", "Action"],
    "platforms": ["PC", "PlayStation 5", "Xbox Series S/X"],
    "imageUrl": "https://media.rawg.io/media/games/...",
    "releasedAt": "2025-10-21",
    "updatedAt": 1774793000
  }]
}
```

> **변경사항 (2026-03-30)**: 기존 역대 metacritic Top 20에서 최근 2년 인기 게임 Top 20으로 변경.
> `added` 필드가 추가됨. `metacritic`은 nullable로 변경 (최신 게임은 아직 점수 없을 수 있음).
> `rating` 필드 추가 (RAWG 유저 평점, string).

---

## 5. 할인 게임 (PSN + Steam)

### GET /api/games/deals

PSN(PlatPrices) + Steam(CheapShark) 할인 게임 통합 리스트. 할인율 내림차순 정렬.

| Query | Type | Default | 설명 |
|---|---|---|---|
| store | string | - | `psn` 또는 `steam` (미지정 시 전체) |
| region | string | - | PSN 리전: `KR`, `US` (Steam은 해당 없음) |
| ps5 | "true" | - | PS5 게임만 (PSN only) |
| page | number | 1 | 페이지 |
| limit | number | 20 | 페이지 크기 |

### PSN 할인 응답

```jsonc
// GET /api/games/deals?store=psn&region=KR
{
  "data": [{
    "id": 9,
    "store": "psn",
    "storeId": "15758",       // PlatPrices PPID
    "name": "Need for Speed Heat - Deluxe Edition",
    "imageUrl": "https://image.api.playstation.com/...",
    "region": "KR",
    "basePrice": 83000,       // 정가 (원 단위, 센트 아님)
    "salePrice": 8300,        // 세일가
    "plusPrice": 8300,         // PS Plus 가격
    "discountPercent": 90,
    "metacritic": null,
    "steamRating": null,
    "isPs4": 1,               // 1 = PS4 지원
    "isPs5": 0,               // 0 = PS5 미지원
    "discountedUntil": "2026-04-08 14:59:00",  // 세일 종료일
    "storeUrl": "https://platprices.com/ko-kr/game/...",
    "updatedAt": 1774788259
  }],
  "meta": { "total": 12, "page": 1, "limit": 20 }
}
```

### Steam 할인 응답

```jsonc
// GET /api/games/deals?store=steam
{
  "data": [{
    "id": 189,
    "store": "steam",
    "storeId": "N49tNWsA...",  // CheapShark dealID
    "name": "Worms W.M.D",
    "imageUrl": "https://shared.fastly.steamstatic.com/...",
    "region": null,            // Steam은 리전 없음
    "basePrice": 2999,         // 정가 (USD cents, $29.99)
    "salePrice": 149,          // 세일가 (USD cents, $1.49)
    "plusPrice": null,
    "discountPercent": 95,
    "metacritic": 76,          // 메타크리틱 점수
    "steamRating": 83,         // Steam 사용자 평점 (%)
    "isPs4": null,
    "isPs5": null,
    "discountedUntil": null,   // Steam은 종료일 미제공
    "storeUrl": "https://store.steampowered.com/app/327030",
    "updatedAt": 1774788260
  }],
  "meta": { "total": 266, "page": 1, "limit": 20 }
}
```

### 가격 단위 주의

| Store | 통화 | 단위 | 예시 |
|---|---|---|---|
| PSN KR | KRW | 원 | `83000` = 83,000원 |
| PSN US | USD | cents | `2999` = $29.99 |
| Steam | USD | cents | `2999` = $29.99 |

프론트에서 포맷할 때 `store`와 `region`에 따라 분기 필요:
- PSN KR: `${price.toLocaleString()}원`
- PSN US / Steam: `$${(price / 100).toFixed(2)}`

---

## 어드민 API (인증 필요)

`/api/admin/games` 경로로 CUD 제공. `X-API-Key` 헤더 필수.

| Method | Path | 설명 |
|---|---|---|
| POST | /api/admin/games | 게임 추가 |
| PUT | /api/admin/games/:id | 게임 수정 |
| DELETE | /api/admin/games/:id | 게임 삭제 |

Body는 `items_base` 필드 (`name`, `imageUrl`, `rating`, `memo`)와 `games` 필드 (`genre`, `playHours`, `platform`, `metacritic`, `releasedAt`, `difficulty`)를 flat하게 전달.

---

## 6. PS5 출시 예정작

### GET /api/games/upcoming

RAWG API 기반 PS5 출시 예정작 목록. `added` 내림차순 정렬.

```jsonc
// Response
{
  "data": [{
    "id": 1,
    "rawgId": 58550,
    "name": "Grand Theft Auto VI",
    "added": 660,              // 위시리스트/라이브러리 추가 수
    "rating": "3.64",          // RAWG 유저 평점 (5점 만점, string)
    "metacritic": null,        // 메타크리틱 점수 (미출시라 대부분 null)
    "genre": ["Action", "Adventure"],
    "platforms": ["PlayStation 5", "Xbox Series S/X"],
    "imageUrl": "https://media.rawg.io/media/games/...",
    "releasedAt": "2026-11-19",
    "updatedAt": 1774793000
  }]
}
```

> 페이지네이션 없음 — 전체 목록 반환.

---

## 데이터 갱신 주기

| 데이터 | sync 스크립트 | 권장 주기 |
|---|---|---|
| 내 게임 (PSN) | `bun run scripts/sync-games.ts` | 주 1회 |
| 인기 게임 Top 20 | `bun run scripts/sync-game-rankings.ts` | 주 1회 |
| PSN + Steam 할인 | `bun run scripts/sync-game-deals.ts` | 12시간마다 |
