"use client";

import { useState, useEffect, useCallback } from "react";
import { X, StickyNote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const NOTIFICATION_DELAY_MS = 1200;
const CLOSE_ANIMATION_MS = 200;

interface NotificationItem {
  id: string;
  content: React.ReactNode;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "postit",
    content: (
      <>
        <div className="flex items-center gap-2">
          <StickyNote className="text-neo-text size-4" strokeWidth={2.5} />
          <p className="font-neo-heading text-neo-text text-base leading-snug font-bold">
            익명{" "}
            <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-1.5 py-0.5">
              포스트잇
            </span>{" "}
            게시판
          </p>
        </div>
        <p className="text-neo-text mt-2 text-[13px] leading-relaxed font-semibold">
          바탕화면에서 포스트잇을 뜯어 붙여보세요!
        </p>
        <p className="text-neo-text mt-1 text-[11px] leading-relaxed font-medium">
          포스트잇 기능은{" "}
          <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-1.5 py-0.5 text-[10px] font-black">
            🖥️ 데스크톱
          </span>{" "}
          에서 이용할 수 있어요.
        </p>
        <p className="text-neo-text mt-1 text-[11px] leading-relaxed font-bold">
          피드백 및 인사말은 언제든 환영!
        </p>
      </>
    ),
  },
  {
    id: "renewal",
    content: (
      <>
        <p className="font-neo-heading text-neo-text text-base leading-snug font-bold">
          Kyuniverse 페이지를
          <br />
          <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-2 py-0.5">
            renewal 했습니다!
          </span>
        </p>
        <p className="text-neo-text mt-2 text-[13px] leading-relaxed font-semibold">
          이번 컨셉은{" "}
          <span className="bg-neo-primary inline-block rotate-1 rounded-md px-1.5 font-black text-white">
            NEO BRUTALISM
          </span>{" "}
          입니다.
        </p>
      </>
    ),
  },
];

export default function MobileNotification() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), NOTIFICATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), CLOSE_ANIMATION_MS);
  };

  if (!visible) return null;

  const total = NOTIFICATIONS.length;

  return (
    <div
      className={`absolute right-4 bottom-6 left-4 z-50 ${
        closing ? "neo-notification--closing" : "neo-notification--opening"
      }`}
    >
      <div className="border-neo-border bg-neo-surface shadow-neo-md overflow-hidden rounded-xl border-3">
        {/* Title */}
        <div className="bg-neo-warning border-neo-border flex items-center justify-between border-b-3 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔔</span>
            <span className="font-neo-heading text-neo-text text-xs font-bold">
              알림
            </span>
            <span className="bg-neo-info border-neo-border rounded-full border-2 px-1.5 py-0 text-[10px] leading-4 font-black text-white">
              {total}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClose}
              className="neo-btn bg-neo-primary border-neo-border flex size-6 items-center justify-center rounded-md border-2 text-xs font-bold"
            >
              <X className="size-3.5" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Carousel content */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="min-w-0 flex-[0_0_100%] p-4">
                {notif.content}
              </div>
            ))}
          </div>
        </div>

        {/* Dots + OK button */}
        <div className="px-4 pb-4">
          <div className="mb-3 flex justify-center gap-1.5">
            {NOTIFICATIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className={`size-2 rounded-full border-2 border-black transition-all ${
                  i === currentIndex ? "bg-neo-info w-5" : "bg-neo-surface"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="neo-btn bg-neo-secondary border-neo-border shadow-neo-sm w-full rounded-lg border-2 py-2 text-sm font-extrabold tracking-wide"
          >
            OK, GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
