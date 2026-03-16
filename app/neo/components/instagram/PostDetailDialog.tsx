"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Post, InfluencerPost, PostChild } from "./types";
import InstagramIcon from "../icons/InstagramIcon";

type DialogPost = (Post | InfluencerPost) & {
  hashtag_name?: string;
  collection_type?: string;
};

interface PostDetailDialogProps {
  post: DialogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MediaTypeBadge({ type }: { type: string }) {
  const config: Record<string, { bg: string; label: string }> = {
    IMAGE: { bg: "bg-neo-secondary", label: "IMAGE" },
    VIDEO: { bg: "bg-neo-info", label: "VIDEO" },
    CAROUSEL_ALBUM: { bg: "bg-neo-success", label: "CAROUSEL" },
  };
  const { bg, label } = config[type] ?? { bg: "bg-gray-300", label: type };
  return (
    <span
      className={`${bg} border-neo-border rounded-md border-2 px-3 py-1 text-[10px] font-bold tracking-wider`}
    >
      {label}
    </span>
  );
}

function CarouselMedia({ slides }: { slides: PostChild[] }) {
  const sorted = [...slides].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Carousel className="h-full w-full">
      <CarouselContent className="ml-0 h-full">
        {sorted.map((child) => (
          <CarouselItem key={child.id} className="h-full pl-0">
            {child.media_type === "VIDEO" ? (
              <video
                src={child.media_url ?? undefined}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={child.media_url ?? ""}
                alt={`slide ${child.sort_order + 1}`}
                className="h-full w-full object-cover"
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      {sorted.length > 1 && (
        <>
          <CarouselPrevious className="border-neo-border shadow-neo-sm text-neo-text left-3 h-8 w-8 border-2 bg-white/90" />
          <CarouselNext className="border-neo-border shadow-neo-sm text-neo-text right-3 h-8 w-8 border-2 bg-white/90" />
        </>
      )}
    </Carousel>
  );
}

export default function PostDetailDialog({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neo-border shadow-neo-lg max-w-[900px] gap-0 overflow-hidden rounded-2xl border-[5px] bg-white p-0 [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>포스트 상세</DialogTitle>
        </VisuallyHidden>
        <div className="flex h-[620px]">
          <div className="relative flex w-[480px] shrink-0 items-center justify-center overflow-hidden bg-[#1A1A1A]">
            {post.media_type === "CAROUSEL_ALBUM" && post.children?.length ? (
              <CarouselMedia slides={post.children} />
            ) : post.media_url ? (
              post.media_type === "VIDEO" ? (
                <video
                  src={post.media_url}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.media_url}
                  alt={post.caption ?? "post image"}
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <div className="text-sm font-medium text-white/50">
                이미지 없음
              </div>
            )}
          </div>

          <div className="bg-neo-bg flex min-w-0 flex-1 flex-col">
            <div className="bg-neo-accent border-neo-border flex h-14 shrink-0 items-center justify-between border-b-3 px-5">
              <div className="flex items-center gap-2.5">
                <InstagramIcon size={20} />
                <span className="text-neo-text font-neo-heading text-base font-black">
                  {post.hashtag_name ?? "Post"}
                </span>
                <MediaTypeBadge type={post.media_type} />
              </div>
            </div>

            <div className="neo-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              <div className="bg-neo-surface border-neo-border shadow-neo-md rounded-xl border-3 p-4">
                <p className="text-neo-text/50 font-neo-heading mb-2 text-[10px] font-black tracking-[2px]">
                  CAPTION
                </p>
                <p className="text-neo-text m-0 text-sm leading-relaxed font-medium wrap-break-word whitespace-pre-wrap">
                  {post.caption ?? "캡션 없음"}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="bg-neo-primary border-neo-border shadow-neo-sm flex h-12 items-center gap-2 rounded-xl border-3 px-5">
                  <span className="text-lg">❤️</span>
                  <span className="text-neo-text text-base font-black">
                    {post.like_count.toLocaleString()}
                  </span>
                  <span className="text-neo-text/60 text-xs font-bold">
                    likes
                  </span>
                </div>
                <div className="bg-neo-info border-neo-border shadow-neo-sm flex h-12 items-center gap-2 rounded-xl border-3 px-5">
                  <span className="text-lg">💬</span>
                  <span className="text-neo-text text-base font-black">
                    {post.comments_count.toLocaleString()}
                  </span>
                  <span className="text-neo-text/60 text-xs font-bold">
                    comments
                  </span>
                </div>
              </div>

              {post.hashtag_name && (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neo-secondary text-neo-text border-neo-border shadow-neo-sm rounded-lg border-3 px-3 py-1.5 text-xs font-black">
                    #{post.hashtag_name}
                  </span>
                </div>
              )}

              <div className="flex-1" />

              <div className="flex flex-col gap-3">
                <div className="bg-neo-border h-[3px] rounded-sm" />
                <div className="text-neo-text/50 text-xs font-bold">
                  {formatDate(post.timestamp)}
                </div>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-neo-accent text-neo-text border-neo-border shadow-neo-md hover:shadow-neo-sm flex h-12 items-center justify-center gap-2 rounded-xl border-3 text-sm font-black no-underline transition-all hover:translate-y-[1px]"
                >
                  <span>↗</span>
                  Instagram에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
