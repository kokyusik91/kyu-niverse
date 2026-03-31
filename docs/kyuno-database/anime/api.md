# Anime API Reference

kyuno-database의 anime 관련 공개 API 명세. 모든 엔드포인트는 GET만 제공하며 인증 불필요.

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

## 1. 애니 목록 (내가 본/보는 애니)

### GET /api/anime

upcoming(방영 예정작)을 **제외**한 애니 목록. Finished Airing + Currently Airing만 반환.

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 제목 검색 (한/일/영 모두 매칭) |
| rating | number | - | 내 평점 필터 |
| status | string | - | "Finished Airing" / "Currently Airing" |
| mainOnly | "true" | - | 본편만 (후속작/극장판 제외) |
| page | number | 1 | 페이지 |
| limit | number | 20 | 페이지 크기 |

```jsonc
// Response
{
  "data": [{
    "items_base": {
      "id": 104,
      "category": "anime",
      "name": "Chainsaw Man",
      "imageUrl": "https://myanimelist.net/images/anime/1806/126216l.jpg",
      "rating": 83,           // 내 평점 (null이면 미평가)
      "memo": "후지모토 타츠키 원작",
      "createdAt": 1774416444,
      "updatedAt": 1774416444
    },
    "anime": {
      "itemId": 104,
      "malId": 44511,
      "parentId": null,        // null = 본편, 숫자 = 후속작의 본편 ID
      "type": "TV",            // "TV" | "Movie" | "ONA" | "TV Special" | "OVA"
      "titleJa": "チェンソーマン",
      "titleEn": "Chainsaw Man",
      "studio": "MAPPA",
      "genre": "Action, Fantasy",
      "themes": "Gore, Urban Fantasy",
      "episodes": 12,
      "status": "Finished Airing",
      "source": "Manga",
      "score": "8.43",         // MAL 점수 (string, null 가능)
      "rank": 197,
      "popularity": 50,
      "members": 1933308,
      "favorites": 55308,
      "airedFrom": "2022-10-12",
      "airedTo": "2022-12-28",
      "season": "fall",
      "year": 2022,
      "duration": "24 min per ep",
      "ageRating": "R - 17+ (violence & profanity)",
      "synopsis": "Denji is robbed of a normal teenage life...",
      "synopsisKr": "덴지는 평범한 십대의 삶을 빼앗기고...",
      "malUrl": "https://myanimelist.net/anime/44511/Chainsaw_Man"
    }
  }],
  "meta": { "total": 28, "page": 1, "limit": 20 }
}
```

---

## 2. Upcoming 애니 목록

### GET /api/anime/upcoming

방영 예정작(Not yet aired)만 반환. score, rank 등은 대부분 null.

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 제목 검색 (한/일/영) |
| mainOnly | "true" | - | 본편만 |
| page | number | 1 | |
| limit | number | 20 | |

응답 구조는 `/api/anime`과 동일. `anime.status`는 항상 `"Not yet aired"`.

---

## 3. 애니 상세

### GET /api/anime/:id

단건 조회. **후속작/극장판 목록 + 출연 캐릭터**를 함께 반환.

```jsonc
{
  "data": {
    "items_base": { ... },
    "anime": { ... },
    "sequels": [
      {
        "items_base": { "id": 105, "name": "Chainsaw Man Movie: Reze-hen", ... },
        "anime": { "type": "Movie", "parentId": 104, "score": "9.09", ... }
      }
    ],
    "characters": [
      {
        "id": 1,
        "nameKr": "덴지",
        "nameEn": "Denji",
        "nameJp": "デンジ",
        "role": "주인공",
        "gender": "남",
        "imageUrl": "https://cdn.myanimelist.net/images/characters/...",
        "favorites": 22728
      }
    ]
  }
}
```

---

## 4. 캐릭터

### GET /api/anime/:animeId/characters

해당 작품에 출연하는 캐릭터 목록 (appearances M:N 테이블 기반).

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 이름 검색 (한/일/영) |
| role | string | - | 역할 필터 ("주인공" / "주요" / "Supporting" 등) |
| page | number | 1 | |
| limit | number | 50 | |

```jsonc
{
  "data": [{
    "id": 1,
    "animeId": 104,
    "malId": 170732,
    "nameKr": "덴지",
    "nameEn": "Denji",
    "nameJp": "デンジ",
    "role": "주인공",
    "gender": "남",
    "species": "인간/악마",
    "age": "16",
    "imageUrl": "https://cdn.myanimelist.net/images/characters/...",
    "favorites": 22728,
    "malUrl": "https://myanimelist.net/character/170732/Denji",
    "voiceActorJp": "토다 키쿠노스케",
    "voiceActorEn": "Strange, Ciarán",
    "voiceActorKr": "Shin, Na-ri",
    "description": "The main protagonist of Chainsaw Man...",
    "descriptionKr": "체인소 맨의 주인공으로...",
    "createdAt": 1774416444
  }],
  "meta": { "total": 50, "page": 1, "limit": 50 }
}
```

### GET /api/anime/:animeId/characters/:charId

캐릭터 단건 조회. 응답 구조 동일 (description, descriptionKr 포함).

---

## 5. 아크

### GET /api/anime/:animeId/arcs

스토리 아크 목록 (arc_order 순 정렬).

```jsonc
{
  "data": [
    { "id": 1, "animeId": 104, "name": "도입편", "arcOrder": 1, "episodeRange": "1-4" },
    { "id": 2, "animeId": 104, "name": "영원의 악마편", "arcOrder": 2, "episodeRange": "5-8" }
  ]
}
```

### GET /api/anime/:animeId/arcs/:arcId

아크 단건 조회.

---

## 6. 캐릭터 관계

### GET /api/anime/:animeId/relationships

캐릭터 간 관계 목록.

| Query | Type | 설명 |
|---|---|---|
| arcId | number | 특정 아크의 관계만 |
| charId | number | 특정 캐릭터의 관계만 |
| type | string | 관계 유형 필터 ("동료", "호감", "적대" 등) |

```jsonc
{
  "data": [{
    "id": 1,
    "animeId": 104,
    "characterAId": 1,
    "characterBId": 2,
    "relationType": "호감",
    "direction": "a_to_b",    // "a_to_b" | "b_to_a" | "mutual"
    "description": "짝사랑",
    "arcId": null              // null = 시리즈 전체에 적용
  }]
}
```

### GET /api/anime/:animeId/relationship-graph

vis.js 호환 그래프 데이터 (nodes + edges).

| Query | Type | 설명 |
|---|---|---|
| arcId | number | 특정 아크까지의 관계만 |

```jsonc
{
  "data": {
    "animeId": 104,
    "arcId": null,
    "arcs": [
      { "id": 1, "name": "도입편", "arcOrder": 1, ... }
    ],
    "nodes": [
      { "id": 1, "label": "덴지", "image": "https://...", "group": "주인공", "title": "Denji" }
    ],
    "edges": [
      {
        "id": 1, "from": 1, "to": 2,
        "label": "호감",
        "arrows": { "to": true },
        "title": "짝사랑",
        "arcId": null
      }
    ]
  }
}
```

**arrows 매핑:**
- `direction: "a_to_b"` -> `{ to: true }`
- `direction: "b_to_a"` -> `{ from: true }`
- `direction: "mutual"` -> `{}`

---

## 데이터 현황

| 항목 | 건수 |
|---|---|
| 본 애니 (Finished/Currently Airing) | ~28 |
| Upcoming (Not yet aired) | ~472 |
| 캐릭터 | 503 |
| 캐릭터 description 보유 | 314 (189명은 MAL에 설명 없음) |
| 캐릭터 description_kr 번역 | 314 |
| 애니 synopsis_kr 번역 | 559 |
| 출연 정보 (appearances) | 842 |
