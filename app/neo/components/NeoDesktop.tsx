"use client";

import { Suspense } from "react";
import { WindowManagerProvider } from "./WindowManager";
import Desktop from "./Desktop";
import BlogWindowSync from "./BlogWindowSync";
import MobileLayout from "./mobile/MobileLayout";
import { useIsMobile } from "../hooks/useIsMobile";
import type { BlogFrontmatter } from "@/lib/blog";

export interface BlogPostData {
  slug: string;
  frontmatter: BlogFrontmatter;
  html: string;
}

export default function NeoDesktop({
  blogPosts,
  initialPostSlug,
  books,
}: {
  blogPosts: BlogPostData[];
  initialPostSlug?: string;
  books?: { id: string; coverUrl: string; title: string }[];
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Suspense>
        <MobileLayout blogPosts={blogPosts} initialPostSlug={initialPostSlug} />
      </Suspense>
    );
  }

  return (
    <WindowManagerProvider>
      <Suspense>
        <BlogWindowSync initialPostSlug={initialPostSlug} />
      </Suspense>
      <Desktop
        blogPosts={blogPosts}
        initialPostSlug={initialPostSlug}
        books={books ?? []}
      />
    </WindowManagerProvider>
  );
}
