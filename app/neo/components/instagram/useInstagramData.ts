"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { ViewMode, CollectionType, UnifiedPost } from "./types";
import { fetchHashtags, fetchInfluencers, fetchHashtagPosts, fetchInfluencerPosts } from "./api";

function useInfiniteScroll(
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return sentinelRef;
}

export function useInstagramData() {
  const [viewMode, setViewMode] = useState<ViewMode>("influencer");
  const [selectedHashtagId, setSelectedHashtagId] = useState<number | null>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<number | null>(null);
  const [collectionType, setCollectionType] = useState<CollectionType>("recent");
  const [selectedPost, setSelectedPost] = useState<UnifiedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: hashtags = [] } = useQuery({
    queryKey: ["hashtags"],
    queryFn: fetchHashtags,
  });

  const { data: influencers = [] } = useQuery({
    queryKey: ["influencers"],
    queryFn: fetchInfluencers,
  });

  useEffect(() => {
    if (hashtags.length > 0 && selectedHashtagId === null) {
      setSelectedHashtagId(hashtags[0].id);
    }
  }, [hashtags, selectedHashtagId]);

  useEffect(() => {
    if (influencers.length > 0 && selectedInfluencerId === null) {
      setSelectedInfluencerId(influencers[0].id);
    }
  }, [influencers, selectedInfluencerId]);

  const hashtagPostsQuery = useInfiniteQuery({
    queryKey: ["hashtagPosts", selectedHashtagId, collectionType],
    queryFn: ({ pageParam }) =>
      fetchHashtagPosts({ hashtagId: selectedHashtagId!, type: collectionType, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.pagination.totalPages ? lastPageParam + 1 : undefined,
    enabled: viewMode === "hashtag" && selectedHashtagId !== null,
  });

  const influencerPostsQuery = useInfiniteQuery({
    queryKey: ["influencerPosts", selectedInfluencerId],
    queryFn: ({ pageParam }) =>
      fetchInfluencerPosts({ influencerId: selectedInfluencerId!, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.pagination.totalPages ? lastPageParam + 1 : undefined,
    enabled: viewMode === "influencer" && selectedInfluencerId !== null,
  });

  const activeQuery = viewMode === "hashtag" ? hashtagPostsQuery : influencerPostsQuery;
  const posts = useMemo<UnifiedPost[]>(() => {
    if (!activeQuery.data) return [];
    return activeQuery.data.pages.flatMap((p) => p.posts as UnifiedPost[]);
  }, [activeQuery.data]);

  const sentinelRef = useInfiniteScroll(
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
    activeQuery.fetchNextPage,
  );

  const selectedHashtag = hashtags.find((h) => h.id === selectedHashtagId);
  const selectedInfluencer = influencers.find((i) => i.id === selectedInfluencerId);

  const currentTitle = viewMode === "hashtag"
    ? selectedHashtag?.name ?? "선택하세요"
    : selectedInfluencer?.username ?? "선택하세요";

  const openPostDetail = useCallback((post: UnifiedPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
  }, []);

  return {
    viewMode,
    setViewMode,
    collectionType,
    setCollectionType,
    hashtags,
    influencers,
    selectedHashtagId,
    setSelectedHashtagId,
    selectedInfluencerId,
    setSelectedInfluencerId,
    posts,
    activeQuery,
    sentinelRef,
    currentTitle,
    selectedPost,
    dialogOpen,
    setDialogOpen,
    openPostDetail,
  };
}
