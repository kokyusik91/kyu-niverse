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
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export type SortKey = "playHours" | "metacritic" | "name" | "releasedAt";
