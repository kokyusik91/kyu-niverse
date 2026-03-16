"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/old/providers/ColorProvider";
import Link from "next/link";
import { GITHUB_BLOG_URL, MIMOTICON_URL } from "@/app/constants/external-url";
import { useDesciption } from "@/app/old/providers/DescriptionProvider";
import OriginalContents from "../OriginalContents";
import DescriptionContents from "../DescriptionContents";

type GithubBlogProps = {
  children: ReactNode;
};

export default function GithubBlog({ children }: GithubBlogProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();
  return (
    <Link
      href={GITHUB_BLOG_URL}
      target="_blank"
      className={`target h-1/4 transition-all ${generateColor("bg-blue-400")} p-3`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          규모티콘 🧒🏻
        </h1>
        <p>
          저랑은 좀 안 닮았지만, 느낌만 비슷한 <strong>미모티콘</strong> 입니다.
          누르면 저의 기술 블로그로 이동해요~~ 🚀
        </p>
      </DescriptionContents>
    </Link>
  );
}
