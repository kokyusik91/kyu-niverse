# Game API 변경 지시서 (2026-03-30)

이 문서는 kyuno-database Game API 변경사항과 kyu-niverse 프론트엔드 대응 작업을 정리한 것이다.

## 변경 요약

| 항목 | Before | After |
|---|---|---|
| `/api/games/rankings` | 역대 metacritic Top 20 (1990년대 게임 포함) | **최근 2년 인기 게임 Top 20** (위시리스트 추가 수 기준) |
| 응답 필드 | `metacritic` (필수) | `added` (추가), `rating` (추가), `metacritic` (nullable로 변경) |

---

## 1. Rankings 응답 구조 변경

### 추가된 필드

```typescript
interface GameRanking {
  id: number;
  rank: number;
  rawgId: number;
  name: string;
  added: number | null;       // ← NEW: 위시리스트/라이브러리 추가 수 (인기 지표)
  rating: string | null;      // ← NEW: RAWG 유저 평점 (5점 만점, string)
  metacritic: number | null;  // ← CHANGED: 기존 필수 → nullable
  genre: string[];
  platforms: string[];
  imageUrl: string | null;
  releasedAt: string | null;
  updatedAt: number;
}
```

### 프론트 대응 작업

- [ ] Rankings 타입 정의에 `added`, `rating` 필드 추가
- [ ] `metacritic`을 nullable로 변경 (기존에 필수로 쓰고 있다면 `?` 추가)
- [ ] 랭킹 카드 UI에서 표시할 지표 변경:
  - 기존: metacritic 점수 뱃지
  - 변경: `added` 수 또는 `rating` 표시 (예: "🔥 2,455" 또는 "⭐ 3.84")
- [ ] 탭 이름 변경: "Metacritic Top 20" → "Hot Games" 또는 "인기 게임"

---

## 2. 실제 응답 예시

```jsonc
// GET /api/games/rankings
{
  "data": [
    {
      "id": 1,
      "rank": 1,
      "rawgId": 872124,
      "name": "Vampire: The Masquerade – Bloodlines 2",
      "added": 2455,
      "rating": "3.84",
      "metacritic": null,
      "genre": ["RPG", "Action"],
      "platforms": ["PC", "PlayStation 5", "Xbox Series S/X"],
      "imageUrl": "https://media.rawg.io/media/games/...",
      "releasedAt": "2025-10-21",
      "updatedAt": 1774793000
    },
    {
      "rank": 2,
      "name": "Hollow Knight: Silksong",
      "added": 1582,
      "rating": "4.36",
      "metacritic": null,
      "releasedAt": "2025-09-04"
      // ...
    },
    {
      "rank": 5,
      "name": "Hades II",
      "added": 814,
      "rating": "4.34",
      "metacritic": null,
      "releasedAt": "2025-09-25"
      // ...
    },
    {
      "rank": 8,
      "name": "Grand Theft Auto VI",
      "added": 660,
      "rating": "3.64",
      "metacritic": null,
      "releasedAt": "2026-11-19"
      // ...
    }
    // ... 총 20개
  ]
}
```

---

## 3. 영향 없는 엔드포인트 (변경 없음)

- `GET /api/games` — 내 게임 목록 (변경 없음)
- `GET /api/games/:id` — 게임 상세 (변경 없음)
- `GET /api/games/stats` — Dashboard 통계 (변경 없음)
- `GET /api/games/deals` — 할인 게임 (변경 없음)

---

## 4. 체크리스트

- [ ] Rankings 타입 업데이트 (`added`, `rating` 추가, `metacritic` nullable)
- [ ] 랭킹 카드 컴포넌트에서 `metacritic` 대신 `added` 또는 `rating` 표시
- [ ] 탭 이름/아이콘 변경 (Metacritic → Hot Games)
- [ ] `metacritic`이 null인 경우 UI 처리 (빈 값 표시 or 숨김)
