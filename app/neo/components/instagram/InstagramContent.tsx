"use client";

import type {
  Hashtag,
  Influencer,
  UnifiedPost,
  ViewMode,
  CollectionType,
} from "./types";
import PostDetailDialog from "./PostDetailDialog";
import QueryProvider from "./QueryProvider";
import InstagramIcon from "../icons/InstagramIcon";
import UserIcon from "../icons/UserIcon";
import { useInstagramData } from "./useInstagramData";
import { Heart, MessageCircle } from "lucide-react";

function getPostThumbnail(post: UnifiedPost): string | null {
  if (post.media_type === "CAROUSEL_ALBUM" && post.children?.length) {
    const firstImage = post.children.find((c) => c.media_type !== "VIDEO");
    return firstImage?.media_url ?? post.children[0].media_url;
  }
  return post.media_url;
}

function PostCard({
  post,
  onClick,
}: {
  post: UnifiedPost;
  onClick: () => void;
}) {
  const thumbnail = getPostThumbnail(post);

  return (
    <button
      type="button"
      className="border-neo-border shadow-neo-sm hover:shadow-neo-md mb-4 w-full cursor-pointer break-inside-avoid overflow-hidden rounded-xl border-3 bg-white text-left transition-transform hover:-translate-y-0.5"
      onClick={onClick}
    >
      {post.media_type === "VIDEO" && post.media_url ? (
        <div className="relative w-full overflow-hidden">
          <video
            src={post.media_url}
            muted
            preload="metadata"
            className="block w-full"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60">
              <span className="ml-0.5 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
            </span>
          </div>
        </div>
      ) : thumbnail ? (
        <div className="relative w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={post.caption ?? ""}
            className="block w-full"
            loading="lazy"
          />
          {post.media_type === "CAROUSEL_ALBUM" &&
            post.children &&
            post.children.length > 1 && (
              <span className="border-neo-border absolute top-2 right-2 rounded border-[1.5px] bg-white/90 px-1.5 py-0.5 text-[10px] font-bold">
                1/{post.children.length}
              </span>
            )}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 p-3.5">
        {post.caption && (
          <p className="m-0 line-clamp-3 text-[13px] leading-relaxed text-gray-700">
            {post.caption}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="fill-neo-primary text-neo-primary size-3.5" />
            {post.like_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="text-neo-info size-3.5" />
            {post.comments_count}
          </span>
        </div>
        {post.media_type !== "IMAGE" && (
          <span
            className={`border-neo-border self-start rounded border-[1.5px] px-2 py-0.5 text-[10px] font-bold ${
              post.media_type === "VIDEO" ? "bg-blue-200" : "bg-purple-200"
            }`}
          >
            {post.media_type === "VIDEO" ? "VIDEO" : "CAROUSEL"}
          </span>
        )}
      </div>
    </button>
  );
}

function HashtagListItem({
  hashtag,
  isActive,
  onClick,
}: {
  hashtag: Hashtag;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left transition-colors ${
        isActive
          ? "border-neo-border shadow-neo-sm border-2 bg-[#C4B5FD]"
          : "border-2 border-transparent hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="text-lg font-black text-[#8B5CF6]">#</span>
      <span className={`text-[13px] ${isActive ? "font-bold" : "font-medium"}`}>
        {hashtag.name}
      </span>
    </button>
  );
}

function InfluencerListItem({
  influencer,
  isActive,
  onClick,
}: {
  influencer: Influencer;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
        isActive
          ? "border-neo-border shadow-neo-sm border-2 bg-[#C4B5FD]"
          : "border-2 border-transparent hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {influencer.profile_picture_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={influencer.profile_picture_url}
          alt={influencer.username}
          className="border-neo-border h-7 w-7 shrink-0 rounded-full border-2 object-cover"
        />
      ) : (
        <span className="border-neo-border flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-gray-200">
          <UserIcon size={16} />
        </span>
      )}
      <div className="flex min-w-0 flex-col">
        <span
          className={`text-[13px] break-all ${isActive ? "font-bold" : "font-medium"}`}
        >
          {influencer.username}
        </span>
        <span className="hidden text-[10px] text-gray-400 @[220px]:block">
          {influencer.followers_count.toLocaleString()} followers
        </span>
      </div>
      {influencer.post_count !== undefined && (
        <span className="border-neo-border ml-auto shrink-0 rounded border-[1.5px] bg-blue-200 px-1.5 py-0.5 text-[10px] font-bold">
          {influencer.post_count}
        </span>
      )}
    </button>
  );
}

function Sidebar({
  viewMode,
  onChangeViewMode,
  hashtags,
  influencers,
  selectedHashtagId,
  onSelectHashtag,
  selectedInfluencerId,
  onSelectInfluencer,
}: {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  hashtags: Hashtag[];
  influencers: Influencer[];
  selectedHashtagId: number | null;
  onSelectHashtag: (id: number) => void;
  selectedInfluencerId: number | null;
  onSelectInfluencer: (id: number) => void;
}) {
  return (
    <div
      className="border-neo-border bg-neo-surface shadow-neo-sm @container m-2 flex min-h-0 flex-col rounded-lg border-3 p-3"
      style={{ width: "20%", minWidth: 200, maxWidth: 280 }}
    >
      <div className="mb-3 flex shrink-0">
        <button
          type="button"
          className={`border-neo-border flex h-9 flex-1 items-center justify-center gap-1.5 rounded-l-lg border-2 text-[13px] ${
            viewMode === "hashtag"
              ? "bg-[#C4B5FD] font-bold"
              : "bg-neo-surface font-medium text-gray-500"
          }`}
          onClick={() => onChangeViewMode("hashtag")}
        >
          <span className="font-black">#</span>
          <span className="hidden @[220px]:inline">Hashtag</span>
        </button>
        <button
          type="button"
          className={`border-neo-border flex h-9 flex-1 items-center justify-center gap-1.5 rounded-r-lg border-2 border-l-0 text-[13px] ${
            viewMode === "influencer"
              ? "bg-[#C4B5FD] font-bold"
              : "bg-neo-surface font-medium text-gray-500"
          }`}
          onClick={() => onChangeViewMode("influencer")}
        >
          <UserIcon size={16} />{" "}
          <span className="hidden @[220px]:inline">Influencer</span>
        </button>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        {viewMode === "hashtag" ? (
          <>
            <p className="px-2 py-1 text-[11px] font-bold tracking-wide text-gray-500 uppercase">
              Hashtag ({hashtags.length})
            </p>
            <div className="flex flex-col gap-0.5">
              {hashtags.map((h) => (
                <HashtagListItem
                  key={h.id}
                  hashtag={h}
                  isActive={selectedHashtagId === h.id}
                  onClick={() => onSelectHashtag(h.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="px-2 py-1 text-[11px] font-bold tracking-wide text-gray-500 uppercase">
              Influencer ({influencers.length})
            </p>
            <div className="flex flex-col gap-0.5">
              {influencers.map((inf) => (
                <InfluencerListItem
                  key={inf.id}
                  influencer={inf}
                  isActive={selectedInfluencerId === inf.id}
                  onClick={() => onSelectInfluencer(inf.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TopBar({
  viewMode,
  currentTitle,
  postCount,
  collectionType,
  onChangeCollectionType,
}: {
  viewMode: ViewMode;
  currentTitle: string;
  postCount: number;
  collectionType: CollectionType;
  onChangeCollectionType: (type: CollectionType) => void;
}) {
  return (
    <div className="border-neo-border flex h-12 shrink-0 items-center justify-between border-b-3 px-5">
      <div className="flex items-center gap-2.5">
        {viewMode === "hashtag" ? (
          <span className="text-xl font-black text-[#8B5CF6]">#</span>
        ) : (
          <UserIcon size={20} />
        )}
        <span className="text-base font-extrabold">{currentTitle}</span>
        <span className="border-neo-border rounded-md border-2 bg-red-200 px-2 py-0.5 text-[10px] font-bold">
          {postCount} posts
        </span>
      </div>
      {viewMode === "hashtag" && (
        <div className="border-neo-border flex overflow-hidden rounded-lg border-2">
          <button
            type="button"
            className={`flex h-[30px] items-center justify-center px-4 text-[12px] ${
              collectionType === "recent"
                ? "bg-[#C4B5FD] font-bold"
                : "bg-neo-surface hover:bg-neo-bg font-semibold text-gray-500"
            }`}
            onClick={() => onChangeCollectionType("recent")}
          >
            최신
          </button>
          <button
            type="button"
            className={`border-neo-border flex h-[30px] items-center justify-center border-l-2 px-4 text-[12px] ${
              collectionType === "top"
                ? "bg-[#C4B5FD] font-bold"
                : "bg-neo-surface hover:bg-neo-bg font-semibold text-gray-500"
            }`}
            onClick={() => onChangeCollectionType("top")}
          >
            인기
          </button>
        </div>
      )}
    </div>
  );
}

function PostGrid({
  posts,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  sentinelRef,
  onPostClick,
}: {
  posts: UnifiedPost[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  sentinelRef: React.RefObject<HTMLDivElement>;
  onPostClick: (post: UnifiedPost) => void;
}) {
  return (
    <div className="neo-scrollbar flex-1 overflow-y-auto p-4">
      {posts.length === 0 && !isLoading ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2">
          <InstagramIcon size={32} />
          <span className="text-sm font-semibold text-gray-400">
            포스트가 없습니다
          </span>
        </div>
      ) : (
        <>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onPostClick(post)}
              />
            ))}
          </div>

          <div
            ref={sentinelRef}
            className="flex h-10 items-center justify-center"
          >
            {(isLoading || isFetchingNextPage) && (
              <span className="text-sm font-semibold text-gray-400">
                불러오는 중...
              </span>
            )}
            {!hasNextPage && posts.length > 0 && !isLoading && (
              <span className="text-xs font-medium text-gray-300">
                모든 포스트를 불러왔습니다
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main ---

function InstagramExplorer() {
  const {
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
  } = useInstagramData();

  return (
    <div className="font-neo text-neo-text bg-neo-bg flex h-full">
      <Sidebar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        hashtags={hashtags}
        influencers={influencers}
        selectedHashtagId={selectedHashtagId}
        onSelectHashtag={setSelectedHashtagId}
        selectedInfluencerId={selectedInfluencerId}
        onSelectInfluencer={setSelectedInfluencerId}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-2 pl-0">
        <div className="border-neo-border bg-neo-surface shadow-neo-sm flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border-3">
          <TopBar
            viewMode={viewMode}
            currentTitle={currentTitle}
            postCount={posts.length}
            collectionType={collectionType}
            onChangeCollectionType={setCollectionType}
          />
          <PostGrid
            posts={posts}
            isLoading={activeQuery.isLoading}
            isFetchingNextPage={activeQuery.isFetchingNextPage}
            hasNextPage={activeQuery.hasNextPage}
            sentinelRef={sentinelRef}
            onPostClick={openPostDetail}
          />
        </div>
      </div>

      <PostDetailDialog
        post={selectedPost}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

export default function InstagramContent() {
  return (
    <QueryProvider>
      <InstagramExplorer />
    </QueryProvider>
  );
}
