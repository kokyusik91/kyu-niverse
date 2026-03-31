// ── 내 게임 ──

export interface GameItem {
  id: number;
  name: string;
  imageUrl: string | null;
  rating: number | null;
  memo: string | null;
  genre: string[];
  playHours: number;
  platform: string;
  metacritic: number | null;
  releasedAt: string | null;
}

export interface GamesApiResponse {
  data: Array<{
    items_base: {
      id: number;
      category: string;
      name: string;
      imageUrl: string | null;
      rating: number | null;
      memo: string | null;
      createdAt: number;
      updatedAt: number;
    };
    games: {
      itemId: number;
      difficulty: string | null;
      genre: string[];
      playHours: number;
      platform: string;
      metacritic: number | null;
      releasedAt: string | null;
    };
  }>;
  meta: { total: number; page: number; limit: number };
}

// ── 통계 ──

export interface GameStats {
  totalGames: number;
  totalPlayHours: number;
  avgMetacritic: number;
  mostPlayed: {
    name: string;
    playHours: number;
    imageUrl: string | null;
  };
}

// ── Metacritic 랭킹 ──

export interface RankingItem {
  id: number;
  rank: number;
  rawgId: number;
  name: string;
  added: number | null;
  rating: string | null;
  metacritic: number | null;
  genre: string[];
  platforms: string[];
  imageUrl: string | null;
  releasedAt: string | null;
  updatedAt: number;
}

// ── PS5 출시 예정 ──

export interface UpcomingItem {
  id: number;
  rawgId: number;
  name: string;
  added: number | null;
  rating: string | null;
  metacritic: number | null;
  genre: string[];
  platforms: string[];
  imageUrl: string | null;
  releasedAt: string | null;
  updatedAt: number;
}

// ── 할인 ──

export interface DealItem {
  id: number;
  store: "psn" | "steam";
  storeId: string;
  name: string;
  imageUrl: string | null;
  region: string | null;
  basePrice: number;
  salePrice: number;
  plusPrice: number | null;
  discountPercent: number;
  metacritic: number | null;
  steamRating: number | null;
  isPs4: number | null;
  isPs5: number | null;
  discountedUntil: string | null;
  storeUrl: string | null;
  updatedAt: number;
}

export interface DealsApiResponse {
  data: DealItem[];
  meta: { total: number; page: number; limit: number };
}