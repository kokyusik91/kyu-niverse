"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWindowState } from "./WindowManager";

export default function BlogWindowSync({
  initialPostSlug,
}: {
  initialPostSlug?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { windows, openWindow, closeWindow } = useWindowState();
  const prevPostParam = useRef(searchParams.get("post"));

  const postParam = searchParams.get("post");
  const blogWindow = windows.find((w) => w.id === "blog");
  const isBlogOpen = blogWindow?.isOpen ?? false;
  const hasPostInUrl = Boolean(initialPostSlug || postParam);

  useEffect(() => {
    if (hasPostInUrl) {
      openWindow("blog");
    }
  }, [hasPostInUrl, openWindow]);

  useEffect(() => {
    const blogClosedWhileUrlExists = !isBlogOpen && Boolean(postParam);
    if (blogClosedWhileUrlExists) {
      router.replace("/neo", { scroll: false });
    }
  }, [isBlogOpen, postParam, router]);

  useEffect(() => {
    const postRemovedFromUrl = Boolean(prevPostParam.current) && !postParam;
    if (postRemovedFromUrl && isBlogOpen) {
      closeWindow("blog");
    }
    prevPostParam.current = postParam;
  }, [postParam, isBlogOpen, closeWindow]);

  return null;
}
