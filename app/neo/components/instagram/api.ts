import type { Hashtag, Post, Influencer, InfluencerPost, ApiResponse, CollectionType } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_HASHTAG_API_URL ?? "http://100.64.5.126:3001";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error ?? "Failed");
  return json.data;
}

export async function fetchHashtags(): Promise<Hashtag[]> {
  return fetchApi<Hashtag[]>("/api/hashtags");
}

export async function fetchInfluencers(): Promise<Influencer[]> {
  return fetchApi<Influencer[]>("/api/influencers");
}

export async function fetchHashtagPosts({
  hashtagId,
  type,
  page,
}: {
  hashtagId: number;
  type: CollectionType;
  page: number;
}) {
  const res = await fetch(
    `${API_BASE}/api/hashtags/${hashtagId}/posts?type=${type}&page=${page}&limit=20`,
  );
  const json: ApiResponse<Post[]> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error ?? "Failed");
  return { posts: json.data, pagination: json.pagination! };
}

export async function fetchInfluencerPosts({
  influencerId,
  page,
}: {
  influencerId: number;
  page: number;
}) {
  const res = await fetch(
    `${API_BASE}/api/influencers/${influencerId}/posts?page=${page}&limit=20`,
  );
  const json: ApiResponse<InfluencerPost[]> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error ?? "Failed");
  return { posts: json.data, pagination: json.pagination! };
}
