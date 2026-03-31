import type {
  AnimeListResponse,
  AnimeDetailResponse,
  CharacterListResponse,
  RelationshipGraphData,
  Arc,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_KYUNO_API_URL;

export async function fetchAnimeList(): Promise<AnimeListResponse> {
  const res = await fetch(`${API_BASE}/api/anime?limit=100&mainOnly=true`);
  if (!res.ok) throw new Error("Failed to fetch anime list");
  return res.json();
}

export async function fetchUpcomingAnime(): Promise<AnimeListResponse> {
  const res = await fetch(`${API_BASE}/api/anime/upcoming?limit=10`);
  if (!res.ok) throw new Error("Failed to fetch upcoming anime");
  return res.json();
}

export async function fetchAnimeDetail(
  id: number,
): Promise<AnimeDetailResponse> {
  const res = await fetch(`${API_BASE}/api/anime/${id}`);
  if (!res.ok) throw new Error("Failed to fetch anime detail");
  const json = await res.json();
  return json.data;
}

export async function fetchCharacters(
  animeId: number,
): Promise<CharacterListResponse> {
  const res = await fetch(
    `${API_BASE}/api/anime/${animeId}/characters?limit=100`,
  );
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

export async function fetchArcs(animeId: number): Promise<Arc[]> {
  const res = await fetch(`${API_BASE}/api/anime/${animeId}/arcs`);
  if (!res.ok) throw new Error("Failed to fetch arcs");
  const json = await res.json();
  return json.data;
}

export async function fetchRelationshipGraph(
  animeId: number,
  arcId?: number,
): Promise<RelationshipGraphData> {
  const params = arcId ? `?arcId=${arcId}` : "";
  const res = await fetch(
    `${API_BASE}/api/anime/${animeId}/relationship-graph${params}`,
  );
  if (!res.ok) throw new Error("Failed to fetch relationship graph");
  const json = await res.json();
  return json.data;
}
