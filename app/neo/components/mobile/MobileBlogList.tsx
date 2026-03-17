"use client";

import { useState } from "react";
import type { BlogPostData } from "../NeoDesktop";

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "dev", label: "개발" },
  { key: "retrospect", label: "회고" },
  { key: "daily", label: "일상" },
  { key: "anime", label: "애니" },
] as const;

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

function formatDate(dateStr: string) {
  const day = new Date(dateStr);
  return `${day.getFullYear()}.${String(day.getMonth() + 1).padStart(2, "0")}.${String(day.getDate()).padStart(2, "0")}`;
}

export default function MobileBlogList({
  posts,
  onSelectPost,
}: {
  posts: BlogPostData[];
  onSelectPost: (slug: string) => void;
}) {
  const [category, setCategory] = useState("all");

  const filteredPosts =
    category === "all"
      ? posts
      : posts.filter((p) => p.frontmatter.category === category);

  return (
    <div className="flex h-full flex-col">
      {/* Category Tabs */}
      <div className="border-neo-border flex shrink-0 gap-2 border-b-3 px-4 py-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setCategory(cat.key)}
            className={`font-neo-heading rounded-lg border-3 px-3 py-1.5 text-xs font-bold transition-colors ${
              category === cat.key
                ? "border-neo-border bg-neo-text text-white shadow-none"
                : "border-neo-border bg-neo-surface text-neo-text shadow-[2px_2px_0px_0px_#1A1A2E]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post Cards */}
      <div className="neo-scrollbar flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {filteredPosts.map((post) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => onSelectPost(post.slug)}
              className="border-neo-border bg-neo-surface shadow-neo-md rounded-xl border-3 p-4 text-left"
            >
              {/* Tags */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {post.frontmatter.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`${getTagColor(tag)} rounded-md border-2 border-neo-border px-2 py-0.5 text-[10px] font-semibold`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="font-neo-heading text-neo-text text-[15px] leading-snug font-bold">
                {post.frontmatter.title}
              </h3>

              {/* Summary */}
              {post.frontmatter.summary && (
                <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-gray-500">
                  {post.frontmatter.summary}
                </p>
              )}

              {/* Meta */}
              <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                <span>{formatDate(post.frontmatter.date)}</span>
                <span>·</span>
                <span>{post.frontmatter.category}</span>
              </div>
            </button>
          ))}

          {filteredPosts.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
