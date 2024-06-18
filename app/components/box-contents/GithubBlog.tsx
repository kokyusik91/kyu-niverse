"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import Link from "next/link";
import { GITHUB_BLOG_URL } from "@/app/constants/external-url";

type GithubBlogProps = {
  children: ReactNode;
};

export default function GithubBlog({ children }: GithubBlogProps) {
  const { generateColor } = useColor();
  return (
    <Link
      href={GITHUB_BLOG_URL}
      target="_blank"
      className={`target h-1/4 transition-all ${generateColor("bg-slate-400")} p-3`}
    >
      {children}
    </Link>
  );
}
