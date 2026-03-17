import type { ReactNode } from "react";

const HASHTAG_REGEX = /(#[\w\uAC00-\uD7A3\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+)/g;

export function formatCaption(text: string): ReactNode[] {
  const parts = text.split(HASHTAG_REGEX);
  return parts.map((part, i) =>
    HASHTAG_REGEX.test(part) ? (
      <span key={i} className="text-[#8B5CF6]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
