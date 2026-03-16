"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { BlogPostData } from "./NeoDesktop";
import BlogIcon from "./icons/BlogIcon";

const FONT_OPTIONS = [
  { key: "pretendard", label: "고딕", className: "font-pretendard" },
  { key: "noto-serif", label: "명조", className: "font-noto-serif" },
  { key: "ibm-plex", label: "IBM", className: "font-ibm-plex" },
] as const;

type FontKey = (typeof FONT_OPTIONS)[number]["key"];

const TAG_COLORS = [
  "bg-neo-info text-white",
  "bg-neo-primary text-white",
  "bg-neo-success text-white",
  "bg-neo-warning text-white",
  "bg-[#a78bfa] text-white",
] as const;

function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++)
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

function FolderIcon({ open }: { open?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {open ? (
        <>
          <path
            d="M4 10V26H28V14H16L13 10H4Z"
            fill="#FFE66D"
            stroke="#1A1A2E"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M4 14H28" stroke="#1A1A2E" strokeWidth="2" />
        </>
      ) : (
        <path
          d="M4 8V26H28V12H16L13 8H4Z"
          fill="#FFE66D"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

const CATEGORY_LABELS: Record<string, { label: string; icon: ReactNode }> = {
  all: { label: "전체", icon: <FolderIcon open /> },
  dev: { label: "개발", icon: <FolderIcon /> },
  retrospect: { label: "회고", icon: <FolderIcon /> },
  daily: { label: "일상", icon: <FolderIcon /> },
  anime: { label: "애니", icon: <FolderIcon /> },
};

function formatDate(dateStr: string) {
  const day = new Date(dateStr);
  return `${day.getFullYear()}.${String(day.getMonth() + 1).padStart(2, "0")}.${String(day.getDate()).padStart(2, "0")}`;
}

function filterPostsByCategory(posts: BlogPostData[], category: string) {
  return category === "all"
    ? posts
    : posts.filter((p) => p.frontmatter.category === category);
}

function usePostNavigation(posts: BlogPostData[], initialPostSlug?: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    posts[0]?.slug ?? null,
  );

  const didSyncInitialUrl = useRef(false);
  const isUserSelection = useRef(false);

  const selectPost = (slug: string) => {
    isUserSelection.current = true;
    setSelectedSlug(slug);
    router.push(`/neo?post=${slug}`, { scroll: false });
  };

  useEffect(() => {
    if (isUserSelection.current) {
      isUserSelection.current = false;
      return;
    }
    const slug = initialPostSlug ?? searchParams.get("post");
    if (slug && posts.some((p) => p.slug === slug)) {
      setSelectedSlug(slug);
    }
  }, [initialPostSlug, searchParams, posts]);

  useEffect(() => {
    if (didSyncInitialUrl.current) return;
    if (!searchParams.get("post") && !initialPostSlug && selectedSlug) {
      didSyncInitialUrl.current = true;
      router.push(`/neo?post=${selectedSlug}`, { scroll: false });
    }
  }, [selectedSlug, searchParams, initialPostSlug, router]);

  const selectedPost = posts.find((p) => p.slug === selectedSlug) ?? null;

  return { selectedSlug, selectedPost, selectPost, setSelectedSlug };
}

function CategoryFilter({
  posts,
  selectedCategory,
  onSelectCategory,
}: {
  posts: BlogPostData[];
  selectedCategory: string;
  onSelectCategory: (category: string, firstSlug: string | null) => void;
}) {
  return (
    <div className="border-neo-border bg-neo-surface shadow-neo-sm m-2 mb-0 shrink-0 rounded-lg border-3 p-3">
      {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => {
        const postsInCategory = filterPostsByCategory(posts, key);
        const isSelected = selectedCategory === key;

        return (
          <button
            key={key}
            onClick={() =>
              onSelectCategory(key, postsInCategory[0]?.slug ?? null)
            }
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold transition-colors ${
              isSelected
                ? "bg-neo-accent border-neo-border shadow-neo-sm border-2"
                : "hover:bg-neo-surface border-2 border-transparent"
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
            <span className="ml-auto text-[11px] text-gray-500">
              {postsInCategory.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PostList({
  posts,
  categoryLabel,
  selectedSlug,
  onSelectPost,
}: {
  posts: BlogPostData[];
  categoryLabel: string;
  selectedSlug: string | null;
  onSelectPost: (slug: string) => void;
}) {
  return (
    <div className="border-neo-border bg-neo-surface shadow-neo-sm scrollbar-hide m-2 min-h-0 flex-1 overflow-y-auto rounded-lg border-3 p-2">
      <p className="px-2 py-1 text-[11px] font-bold tracking-wide text-gray-500 uppercase">
        {categoryLabel} ({posts.length})
      </p>
      {posts.map((post) => {
        const isSelected = selectedSlug === post.slug;
        return (
          <button
            key={post.slug}
            onClick={() => onSelectPost(post.slug)}
            className={`mb-0.5 w-full rounded-lg px-2 py-2 text-left text-[12px] transition-colors ${
              isSelected
                ? "bg-neo-accent border-neo-border shadow-neo-sm text-neo-text border-2"
                : "hover:bg-neo-surface border-2 border-transparent"
            }`}
          >
            <p className="m-0 truncate text-[13px] font-bold">
              {post.frontmatter.thumbnail && (
                <span className="mr-1">{post.frontmatter.thumbnail}</span>
              )}
              {post.frontmatter.title}
            </p>
            <p
              className={`m-0 mt-0.5 text-[11px] ${isSelected ? "text-neo-text/60" : "text-gray-500"}`}
            >
              {formatDate(post.frontmatter.date)}
            </p>
          </button>
        );
      })}
      {posts.length === 0 && (
        <p className="py-4 text-center text-[12px] text-gray-400">
          글이 없습니다.
        </p>
      )}
    </div>
  );
}

function FontSwitcher({
  fontKey,
  onChangeFontKey,
}: {
  fontKey: FontKey;
  onChangeFontKey: (key: FontKey) => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex justify-end px-4 pt-3 pb-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-gray-400">글꼴</span>
        <div className="border-neo-border flex overflow-hidden rounded-lg border-2">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onChangeFontKey(opt.key)}
              className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                fontKey === opt.key
                  ? "bg-neo-accent text-neo-text"
                  : "bg-neo-surface hover:bg-neo-bg text-gray-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostDetail({ post }: { post: BlogPostData }) {
  const [fontKey, setFontKey] = useState<FontKey>("pretendard");
  const fontClassName = FONT_OPTIONS.find((o) => o.key === fontKey)?.className;

  return (
    <div className="border-neo-border bg-neo-surface shadow-neo-sm neo-scrollbar min-h-0 flex-1 overflow-y-auto rounded-lg border-3">
      <FontSwitcher fontKey={fontKey} onChangeFontKey={setFontKey} />
      <div className="max-w-[720px] p-8 pt-2">
        <div className="mb-5 pb-5">
          <h1 className="font-neo-heading [&>span]:bg-neo-accent m-0 text-2xl leading-snug font-bold whitespace-nowrap [&>span]:box-decoration-clone [&>span]:px-1">
            <span>{post.frontmatter.title}</span>
          </h1>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-gray-500">
            <span>{formatDate(post.frontmatter.date)}</span>
            <span className="text-neo-border">|</span>
            <span>{CATEGORY_LABELS[post.frontmatter.category]?.label}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className={`${getTagColor(tag)} border-neo-border rounded-md border-2 px-2 py-0.5 text-[11px] font-semibold`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`neo-blog-content ${fontClassName}`}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
}

function EmptyPostPlaceholder() {
  return (
    <div className="border-neo-border bg-neo-surface shadow-neo-sm flex min-h-0 flex-1 items-center justify-center rounded-lg border-3">
      <div className="text-center">
        <div className="bg-neo-accent border-neo-border shadow-neo-md mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-3">
          <BlogIcon size={36} />
        </div>
        <p className="font-neo-heading text-sm font-bold">글을 선택해주세요</p>
        <p className="mt-1 text-[12px] text-gray-500">
          왼쪽 목록에서 읽고 싶은 글을 클릭하세요
        </p>
      </div>
    </div>
  );
}

export default function BlogContent({
  posts,
  initialPostSlug,
}: {
  posts: BlogPostData[];
  initialPostSlug?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedSlug, selectedPost, selectPost, setSelectedSlug } =
    usePostNavigation(posts, initialPostSlug);

  const filteredPosts = filterPostsByCategory(posts, selectedCategory);
  const categoryLabel = CATEGORY_LABELS[selectedCategory]?.label ?? "전체";

  const handleSelectCategory = (category: string, firstSlug: string | null) => {
    setSelectedCategory(category);
    setSelectedSlug(firstSlug);
  };

  return (
    <div className="font-neo text-neo-text flex h-full">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="neo-btn bg-neo-accent border-neo-border shadow-neo-sm text-neo-text font-neo-heading absolute top-1 left-1 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-3 text-sm font-bold transition-transform duration-100"
        title={sidebarOpen ? "패널 접기" : "패널 펼치기"}
      >
        {sidebarOpen ? "«" : "»"}
      </button>

      <div
        className={`bg-neo-bg flex flex-col overflow-hidden transition-all duration-200 ${sidebarOpen ? "w-[20%] max-w-[300px] min-w-[180px] opacity-100" : "w-0 max-w-0 min-w-0 opacity-0"}`}
      >
        <CategoryFilter
          posts={posts}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <PostList
          posts={filteredPosts}
          categoryLabel={categoryLabel}
          selectedSlug={selectedSlug}
          onSelectPost={selectPost}
        />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden p-2 pl-0">
        {selectedPost ? (
          <PostDetail post={selectedPost} />
        ) : (
          <EmptyPostPlaceholder />
        )}
      </div>
    </div>
  );
}
