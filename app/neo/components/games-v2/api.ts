import type {
  GameItem,
  GamesApiResponse,
  GameStats,
  RankingItem,
  UpcomingItem,
  DealItem,
  DealsApiResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_KYUNO_API_URL;

function toGameItem(raw: GamesApiResponse["data"][0]): GameItem {
  return {
    id: raw.items_base.id,
    name: raw.items_base.name,
    imageUrl: raw.items_base.imageUrl,
    rating: raw.items_base.rating,
    memo: raw.items_base.memo,
    genre: raw.games.genre ?? [],
    playHours: raw.games.playHours,
    platform: raw.games.platform,
    metacritic: raw.games.metacritic,
    releasedAt: raw.games.releasedAt,
  };
}

export async function fetchGames(): Promise<GameItem[]> {
  const res = await fetch(`${API_BASE}/api/games?limit=100`);
  const json: GamesApiResponse = await res.json();
  return json.data.map(toGameItem);
}

export async function fetchStats(): Promise<GameStats> {
  const res = await fetch(`${API_BASE}/api/games/stats`);
  const json: { data: GameStats } = await res.json();
  return json.data;
}

export async function fetchRankings(): Promise<RankingItem[]> {
  const res = await fetch(`${API_BASE}/api/games/rankings`);
  const json: { data: RankingItem[] } = await res.json();
  return json.data;
}

export async function fetchUpcoming(): Promise<UpcomingItem[]> {
  const res = await fetch(`${API_BASE}/api/games/upcoming`);
  const json: { data: UpcomingItem[] } = await res.json();
  return json.data;
}

export async function fetchSteamDeals(): Promise<DealItem[]> {
  const res = await fetch(`${API_BASE}/api/games/deals?store=steam&limit=20`);
  const json: DealsApiResponse = await res.json();
  return json.data;
}

export async function fetchPsnDeals(): Promise<DealItem[]> {
  const res = await fetch(
    `${API_BASE}/api/games/deals?store=psn&region=KR&limit=20`,
  );
  const json: DealsApiResponse = await res.json();
  return json.data;
}

export function formatDealPrice(
  store: "psn" | "steam",
  price: number,
  region?: string | null,
): string {
  if (store === "psn" && region === "KR") {
    return `${price.toLocaleString()}원`;
  }
  return `$${(price / 100).toFixed(2)}`;
}
