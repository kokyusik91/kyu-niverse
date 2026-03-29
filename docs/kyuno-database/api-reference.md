# kyuno-database API Reference

Base URL: `http://localhost:3000` (로컬) / `http://<mac-mini-ip>:3000` (배포)

## 인증

- `GET` 요청: 공개 (인증 불필요)
- `POST/PUT/DELETE` 요청: `X-API-Key` 헤더 필요
- Rate Limit: 60 req/min per IP

---

## 데이터 현황

| 테이블 | 건수 | 설명 |
|---|---|---|
| games | 38 | PSN 게임 |
| clothes | 65 | 옷 (25개 브랜드) |
| anime | 616 | 본편 30 + upcoming 586 |
| music | 0 | 미입력 |
| anime_characters | 519 | 11개 작품 캐릭터 (MAL) |
| anime_character_appearances | 842 | 캐릭터 ↔ 작품 출연 정보 |
| anime_arcs | 0 | 스토리 아크 (추후 입력) |
| character_relationships | 0 | 캐릭터 관계 (추후 입력) |

---

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

## 1. Games

### GET /api/games

게임 목록 조회.

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 이름 검색 (LIKE) |
| rating | number | - | 내 평점 필터 |
| page | number | 1 | 페이지 |
| limit | number | 20 | 페이지 크기 |

```jsonc
// Response
{
  "data": [{
    "items_base": {
      "id": 1, "category": "game", "name": "Elden Ring",
      "imageUrl": "...", "rating": 95, "memo": "...",
      "createdAt": 1710000000, "updatedAt": 1710000000
    },
    "games": {
      "itemId": 1, "difficulty": "hard",
      "genre": ["RPG", "Action"],  // JSON array
      "playHours": 120, "platform": "PS5",
      "metacritic": 96, "releasedAt": "2022-02-25"
    }
  }],
  "meta": { "total": 38, "page": 1, "limit": 20 }
}
```

### GET /api/games/:id

게임 단건 조회. 응답은 위와 동일한 `{ items_base, games }` 구조.

### POST /api/games

```jsonc
// Request Body
{
  "name": "Elden Ring",        // required
  "imageUrl": "...",
  "rating": 95,
  "memo": "...",
  "difficulty": "hard",
  "genre": ["RPG", "Action"],
  "playHours": 120,
  "platform": "PS5",
  "metacritic": 96,
  "releasedAt": "2022-02-25"
}
```

### PUT /api/games/:id

부분 업데이트. 변경할 필드만 전송.

### DELETE /api/games/:id

---

## 2. Clothes

### GET /api/clothes

옷 목록 조회.

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 이름 검색 |
| rating | number | - | 내 평점 필터 |
| type | string | - | 유형 필터 (상의/하의/아우터/악세서리/신발) |
| page | number | 1 | |
| limit | number | 20 | |

```jsonc
// Response data item
{
  "items_base": { "id": 40, "name": "칼하트WIP 디트로이트 자켓", ... },
  "clothes": {
    "itemId": 40, "type": "아우터", "brand": "칼하트WIP",
    "size": "M", "season": "봄/가을", "color": "블랙",
    "subcategory": "자켓", "material": "코튼", "fit": "레귤러"
  }
}
```

### GET /api/clothes/:id
### POST /api/clothes
### PUT /api/clothes/:id
### DELETE /api/clothes/:id

---

## 3. Anime

### GET /api/anime

애니 목록 조회.

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 제목 검색 (한/일/영) |
| rating | number | - | 내 평점 필터 |
| status | string | - | "Finished Airing" / "Not yet aired" / "Currently Airing" |
| mainOnly | "true" | - | 본편만 (parent_id IS NULL) |
| page | number | 1 | |
| limit | number | 20 | |

```jsonc
// Response data item
{
  "items_base": {
    "id": 104, "category": "anime", "name": "Chainsaw Man",
    "imageUrl": "https://myanimelist.net/images/anime/...",
    "rating": 83,  // 내 평점 (x10 저장)
    "memo": "후지모토 타츠키 원작"
  },
  "anime": {
    "itemId": 104,
    "malId": 44511,
    "parentId": null,       // null = 본편, 숫자 = 후속작의 본편 ID
    "type": "TV",           // "TV" | "Movie" | "ONA" | "TV Special" | "OVA"
    "titleJa": "チェンソーマン",
    "titleEn": "Chainsaw Man",
    "studio": "MAPPA",
    "genre": "Action, Fantasy",
    "themes": "Gore, Urban Fantasy",
    "episodes": 12,
    "status": "Finished Airing",
    "source": "Manga",
    "score": "8.43",        // MAL 점수 (string)
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
    "malUrl": "https://myanimelist.net/anime/44511/Chainsaw_Man"
  }
}
```

### GET /api/anime/:id

단건 조회. **후속작 목록 + 출연 캐릭터**를 함께 반환.

```jsonc
{
  "data": {
    "items_base": { ... },
    "anime": { ... },
    "sequels": [
      {
        "items_base": { "id": 105, "name": "Chainsaw Man Movie: Reze-hen", ... },
        "anime": { "type": "Movie", "score": "9.09", ... }
      }
    ],
    "characters": [
      {
        "id": 1, "nameKr": "덴지", "nameEn": "Denji", "nameJp": "デンジ",
        "role": "주인공", "gender": "남",
        "imageUrl": "https://cdn.myanimelist.net/images/characters/...",
        "favorites": 22728
      }
      // ... 49명
    ]
  }
}
```

### POST /api/anime
### PUT /api/anime/:id
### DELETE /api/anime/:id

---

## 4. Anime Characters

### GET /api/anime/:animeId/characters

해당 작품에 **출연하는** 캐릭터 목록 (appearances 기반).

| Query | Type | Default | 설명 |
|---|---|---|---|
| search | string | - | 이름 검색 (한/일/영) |
| role | string | - | 역할 필터 ("주인공" / "주요" / "주요/적" / "적" / "Main" / "Supporting") |
| page | number | 1 | |
| limit | number | 50 | |

```jsonc
// Response data item
{
  "id": 1,
  "animeId": 104,           // 원래 소속 작품 (본편)
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
  "createdAt": 1774416444
}
```

### GET /api/anime/:animeId/characters/:charId
### POST /api/anime/:animeId/characters
### PUT /api/anime/:animeId/characters/:charId
### DELETE /api/anime/:animeId/characters/:charId

---

## 5. Anime Arcs

스토리 아크 (타임라인 슬라이더용).

### GET /api/anime/:animeId/arcs

arc_order 순으로 정렬 반환.

```jsonc
{
  "data": [
    { "id": 1, "animeId": 104, "name": "도입편", "arcOrder": 1, "episodeRange": "1-4" },
    { "id": 2, "animeId": 104, "name": "영원의 악마편", "arcOrder": 2, "episodeRange": "5-8" }
  ]
}
```

### GET /api/anime/:animeId/arcs/:arcId
### POST /api/anime/:animeId/arcs
### PUT /api/anime/:animeId/arcs/:arcId
### DELETE /api/anime/:animeId/arcs/:arcId

---

## 6. Character Relationships

캐릭터 간 관계 (관계도 그래프용).

### GET /api/anime/:animeId/relationships

| Query | Type | 설명 |
|---|---|---|
| arcId | number | 특정 아크의 관계만 |
| charId | number | 특정 캐릭터의 관계만 |
| type | string | 관계 유형 필터 ("동료", "호감", "적대" 등) |

```jsonc
{
  "data": [
    {
      "id": 1,
      "animeId": 104,
      "characterAId": 1,
      "characterBId": 2,
      "relationType": "호감",
      "direction": "a_to_b",   // "a_to_b" | "b_to_a" | "mutual"
      "description": "짝사랑",
      "arcId": null            // null = 시리즈 전체에 적용
    }
  ]
}
```

### GET /api/anime/:animeId/relationship-graph

vis.js 호환 그래프 데이터 반환.

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
        "arrows": { "to": true },  // a_to_b → { to: true }, b_to_a → { from: true }, mutual → {}
        "title": "짝사랑",
        "arcId": null
      }
    ]
  }
}
```

### POST /api/anime/:animeId/relationships
### PUT /api/anime/:animeId/relationships/:relId
### DELETE /api/anime/:animeId/relationships/:relId

---

## 7. Music

### GET /api/music

```jsonc
// Response data item
{
  "items_base": { "id": 200, "name": "Blinding Lights", ... },
  "music": {
    "itemId": 200, "artist": "The Weeknd",
    "album": "After Hours", "genre": "Pop",
    "releaseYear": 2020
  }
}
```

### GET /api/music/:id
### POST /api/music
### PUT /api/music/:id
### DELETE /api/music/:id

---

## 8. Items (전체 검색)

### GET /api/items

모든 카테고리의 items_base 목록 (카테고리별 상세 없음).

| Query | Type | Default |
|---|---|---|
| page | number | 1 |
| limit | number | 20 |

### GET /api/items/search

전체 아이템 검색 (이름 + 메모).

| Query | Type | Default |
|---|---|---|
| q | string | - |
| page | number | 1 |
| limit | number | 20 |

---

## 9. Outfits (AI 코디 추천)

### GET /api/outfits/today

오늘의 코디 추천 조회. 옷 상세 정보(top, bottom, outer, shoes, accessories) 포함.

### GET /api/outfits/history

코디 히스토리 목록 (date DESC).

### GET /api/outfits/:date

특정 날짜 코디 조회 (예: `/api/outfits/2026-03-26`).

### POST /api/outfits/generate

AI 코디 추천 생성 (날씨 + Gemini).

### POST /api/outfits/regenerate

오늘의 코디 재생성.

### PUT /api/outfits/:date/confirm

코디 확정 + 옷 변경 가능.

```jsonc
// Request Body (전부 optional)
{ "topId": 40, "bottomId": 41, "status": "confirmed" }
```

---

## 10. Upload

### POST /api/upload

이미지 업로드.

- Content-Type: `multipart/form-data`
- Fields: `file` (required), `category` (optional, default: "uncategorized")

```jsonc
// Response
{ "data": { "url": "/static/images/anime/uuid.jpg" } }
```

업로드된 이미지는 `GET /static/images/:category/:filename`으로 접근.
