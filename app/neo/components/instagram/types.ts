export interface Hashtag {
  id: number;
  name: string;
  ig_hashtag_id: string | null;
  created_at: string;
}

export interface Post {
  id: number;
  hashtag_id: number;
  ig_media_id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string | null;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  collection_type: "recent" | "top";
  collected_at: string;
  hashtag_name?: string;
  children?: PostChild[];
}

export interface PostChild {
  id: number;
  post_id: number;
  ig_media_id: string;
  media_type: "IMAGE" | "VIDEO";
  media_url: string | null;
  sort_order: number;
}

export interface Influencer {
  id: number;
  username: string;
  name: string | null;
  profile_picture_url: string | null;
  followers_count: number;
  media_count: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  post_count?: number;
}

export interface InfluencerPost {
  id: number;
  influencer_id: number;
  ig_media_id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string | null;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  collected_at: string;
  children?: PostChild[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ViewMode = "hashtag" | "influencer";
export type CollectionType = "recent" | "top";
export type UnifiedPost = Post | (InfluencerPost & { hashtag_id?: never; collection_type?: never; hashtag_name?: never });
