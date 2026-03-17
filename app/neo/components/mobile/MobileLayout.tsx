"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MobileHome from "./MobileHome";
import MobileAppScreen from "./MobileAppScreen";
import MobileBlogList from "./MobileBlogList";
import MobileBlogDetail from "./MobileBlogDetail";
import MobileNotification from "./MobileNotification";
import InstagramContent from "../instagram/InstagramContent";
import GamesContent from "../games/GamesContent";
import {
  ResumeContent,
  PlaceholderContent,
} from "../WindowContents";
import type { BlogPostData } from "../NeoDesktop";

type Screen =
  | { type: "home" }
  | { type: "app"; appId: string }
  | { type: "blog-detail"; appId: "blog"; slug: string };

const APP_TITLES: Record<string, string> = {
  blog: "블로그.exe",
  instagram: "Instagram.exe",
  games: "게임.exe",
  resume: "이력서.exe",
  bookstore: "서점.exe",
};

const APP_COLORS: Record<string, string> = {
  blog: "#FFE66D",
  instagram: "#C4B5FD",
  games: "#FF922B",
  resume: "#FF6B6B",
  bookstore: "#339AF0",
};

export default function MobileLayout({
  blogPosts,
  initialPostSlug,
}: {
  blogPosts: BlogPostData[];
  initialPostSlug?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [screen, setScreen] = useState<Screen>(() => {
    const postSlug = initialPostSlug ?? searchParams.get("post");
    if (postSlug && blogPosts.some((p) => p.slug === postSlug)) {
      return { type: "blog-detail", appId: "blog", slug: postSlug };
    }
    return { type: "home" };
  });

  useEffect(() => {
    const slug = searchParams.get("post");
    if (slug && screen.type === "home" && blogPosts.some((p) => p.slug === slug)) {
      setScreen({ type: "blog-detail", appId: "blog", slug });
    }
  }, [searchParams, blogPosts, screen.type]);

  const goHome = useCallback(() => {
    setScreen({ type: "home" });
    router.push("/", { scroll: false });
  }, [router]);

  const openApp = useCallback((appId: string) => {
    setScreen({ type: "app", appId });
  }, []);

  const openBlogDetail = useCallback(
    (slug: string) => {
      setScreen({ type: "blog-detail", appId: "blog", slug });
      router.push(`/?post=${slug}`, { scroll: false });
    },
    [router],
  );

  const goBack = useCallback(() => {
    if (screen.type === "blog-detail") {
      setScreen({ type: "app", appId: "blog" });
      router.push("/", { scroll: false });
    } else {
      goHome();
    }
  }, [screen, goHome, router]);

  // 블로그 앱이 활성 상태인지 (리스트 or 상세)
  const isBlogActive =
    (screen.type === "app" && screen.appId === "blog") ||
    screen.type === "blog-detail";

  // 블로그 상세가 열려있는지
  const blogDetailSlug =
    screen.type === "blog-detail" ? screen.slug : null;
  const blogDetailPost = blogDetailSlug
    ? blogPosts.find((p) => p.slug === blogDetailSlug) ?? null
    : null;

  return (
    <div
      className="bg-neo-bg font-neo relative h-[100dvh] w-screen overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle, #1A1A2E 1.2px, transparent 1.2px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Home */}
      {screen.type === "home" && (
        <>
          <MobileHome onOpenApp={openApp} />
          <MobileNotification />
        </>
      )}

      {/* Non-blog apps */}
      {screen.type === "app" && screen.appId !== "blog" && (
        <MobileAppScreen
          title={APP_TITLES[screen.appId] ?? screen.appId}
          color={APP_COLORS[screen.appId] ?? "#FFE66D"}
          onBack={goBack}
        >
          {renderAppContent(screen.appId)}
        </MobileAppScreen>
      )}

      {/* Blog: 리스트는 블로그가 열려있는 동안 항상 마운트 유지 */}
      <div
        className={`absolute inset-0 flex flex-col ${isBlogActive ? "" : "pointer-events-none invisible"}`}
      >
        <MobileAppScreen
          title="블로그.exe"
          color={APP_COLORS.blog}
          onBack={goBack}
        >
          <MobileBlogList posts={blogPosts} onSelectPost={openBlogDetail} />
        </MobileAppScreen>
      </div>

      {/* Blog detail: 리스트 위에 오버레이 (불투명 배경) */}
      {blogDetailPost && (
        <div className="absolute inset-0 z-10 flex flex-col bg-white">
          <MobileAppScreen
            title="블로그.exe"
            color={APP_COLORS.blog}
            onBack={goBack}
          >
            <MobileBlogDetail post={blogDetailPost} />
          </MobileAppScreen>
        </div>
      )}
    </div>
  );
}

function renderAppContent(appId: string) {
  switch (appId) {
    case "instagram":
      return <InstagramContent />;
    case "games":
      return <GamesContent />;
    case "resume":
      return <ResumeContent />;
    default:
      return <PlaceholderContent title={appId} icon="📁" />;
  }
}
