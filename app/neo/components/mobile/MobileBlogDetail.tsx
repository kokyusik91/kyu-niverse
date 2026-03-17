"use client";

import { useState } from "react";
import type { BlogPostData } from "../NeoDesktop";

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

const CATEGORY_LABELS: Record<string, string> = {
  dev: "개발",
  retrospect: "회고",
  daily: "일상",
  anime: "애니",
};

const FONT_OPTIONS = [
  { key: "pretendard", label: "고딕", className: "font-pretendard" },
  { key: "noto-serif", label: "명조", className: "font-noto-serif" },
  { key: "ibm-plex", label: "IBM", className: "font-ibm-plex" },
] as const;

type FontKey = (typeof FONT_OPTIONS)[number]["key"];

export default function MobileBlogDetail({ post }: { post: BlogPostData }) {
  const [fontKey, setFontKey] = useState<FontKey>("pretendard");
  const fontClassName = FONT_OPTIONS.find((o) => o.key === fontKey)?.className;

  return (
    <div className="neo-scrollbar h-full overflow-y-auto">
      {/* Header */}
      <div className="border-neo-border border-b-3 px-5 py-5">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className={`${getTagColor(tag)} border-neo-border rounded-md border-2 px-2 py-0.5 text-[11px] font-semibold`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-neo-heading text-neo-text text-xl leading-snug font-bold">
          {post.frontmatter.title}
        </h1>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-[12px] text-gray-500">
          <span>{formatDate(post.frontmatter.date)}</span>
          <span className="text-neo-border">|</span>
          <span>{CATEGORY_LABELS[post.frontmatter.category] ?? post.frontmatter.category}</span>
        </div>
      </div>

      {/* Font Switcher */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400">글꼴</span>
          <div className="border-neo-border flex overflow-hidden rounded-lg border-2">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFontKey(opt.key)}
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

      {/* Content */}
      <div className="px-5 pb-10 pt-2">
        <div
          className={`neo-blog-content ${fontClassName}`}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
}
