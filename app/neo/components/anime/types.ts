export interface AnimeBase {
  id: number;
  category: string;
  name: string;
  imageUrl: string | null;
  rating: number | null;
  memo: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AnimeDetail {
  itemId: number;
  malId: number;
  parentId: number | null;
  type: "TV" | "Movie" | "ONA" | "TV Special" | "OVA";
  titleJa: string | null;
  titleEn: string | null;
  studio: string | null;
  genre: string | null;
  themes: string | null;
  episodes: number | null;
  status: "Finished Airing" | "Currently Airing" | "Not yet aired";
  source: string | null;
  score: string | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  airedFrom: string | null;
  airedTo: string | null;
  season: string | null;
  year: number | null;
  duration: string | null;
  ageRating: string | null;
  synopsis: string | null;
  malUrl: string | null;
}

export interface AnimeItem {
  items_base: AnimeBase;
  anime: AnimeDetail;
}

export interface AnimeDetailResponse {
  items_base: AnimeBase;
  anime: AnimeDetail;
  sequels: AnimeItem[];
  characters: CharacterSummary[];
}

export interface CharacterSummary {
  id: number;
  nameKr: string | null;
  nameEn: string | null;
  nameJp: string | null;
  role: string | null;
  gender: string | null;
  imageUrl: string | null;
  favorites: number | null;
}

export interface Character {
  id: number;
  animeId: number;
  malId: number | null;
  nameKr: string | null;
  nameEn: string | null;
  nameJp: string | null;
  role: string | null;
  gender: string | null;
  species: string | null;
  age: string | null;
  imageUrl: string | null;
  favorites: number | null;
  malUrl: string | null;
  voiceActorJp: string | null;
  voiceActorEn: string | null;
  voiceActorKr: string | null;
  createdAt: number;
}

export interface Arc {
  id: number;
  animeId: number;
  name: string;
  arcOrder: number;
  episodeRange: string | null;
}

export interface RelationshipGraphData {
  animeId: number;
  arcId: number | null;
  arcs: Arc[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: number;
  label: string;
  image: string | null;
  group: string;
  title: string;
}

export interface GraphEdge {
  id: number;
  from: number;
  to: number;
  label: string;
  arrows: { to?: boolean; from?: boolean };
  title: string;
  arcId: number | null;
}

export interface AnimeListResponse {
  data: AnimeItem[];
  meta: { total: number; page: number; limit: number };
}

export interface CharacterListResponse {
  data: Character[];
  meta: { total: number; page: number; limit: number };
}

export type AnimeViewState =
  | { view: "list" }
  | { view: "detail"; animeId: number }
  | { view: "characters"; animeId: number };

export type AnimeTab = "anime" | "characters";
