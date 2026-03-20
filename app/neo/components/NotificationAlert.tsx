"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  X,
  StickyNote,
  Music,
  Droplets,
  Sunrise,
  Flame,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const NOTIFICATION_DELAY_MS = 1500;
const CLOSE_ANIMATION_MS = 200;

interface NotificationItem {
  id: string;
  content: React.ReactNode;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "music",
    content: (
      <>
        <div className="flex items-center gap-2">
          <Music className="text-neo-text size-5" strokeWidth={2.5} />
          <p className="font-neo-heading text-neo-text text-lg leading-snug font-bold">
            <span className="bg-neo-primary border-neo-border inline-block rotate-1 rounded-md border-2 px-1.5 py-0.5">
              Music Player
            </span>{" "}
            등장!
          </p>
        </div>
        <p className="text-neo-text mt-3 text-sm leading-relaxed font-semibold">
          우측 상단의{" "}
          <span className="bg-neo-primary border-neo-border inline-flex size-5 -translate-y-px items-center justify-center rounded-full border-2 align-middle">
            <Music className="size-3" strokeWidth={3} />
          </span>{" "}
          버튼을 눌러보세요!
        </p>
        <p className="text-neo-text mt-2 text-xs leading-relaxed font-medium">
          SUNO AI로 만든 Lo-fi 트랙{" "}
          <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-1.5 py-0.5 text-[10px] font-black">
            3곡
          </span>{" "}
          수록
        </p>
        <div className="mt-2 flex gap-1.5">
          {[
            { icon: Droplets, name: "Neon Tears" },
            { icon: Sunrise, name: "Dawn Blue" },
            { icon: Flame, name: "残り火" },
          ].map(({ icon: Icon, name }) => (
            <span
              key={name}
              className="bg-neo-info border-neo-border flex items-center gap-1 rounded-md border-2 px-1.5 py-0.5 text-[10px] font-bold"
            >
              <Icon className="size-3" strokeWidth={2.5} />
              {name}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "postit",
    content: (
      <>
        <div className="flex items-center gap-2">
          <StickyNote className="text-neo-text size-5" strokeWidth={2.5} />
          <p className="font-neo-heading text-neo-text text-lg leading-snug font-bold">
            익명{" "}
            <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-1.5 py-0.5">
              포스트잇
            </span>{" "}
            게시판
          </p>
        </div>
        <p className="text-neo-text mt-3 text-sm leading-relaxed font-semibold">
          바탕화면 하단의 뭉치에서 포스트잇을 뜯어
          <br />
          아무 곳에나 붙여보세요!
          <span className="bg-neo-primary ml-1 inline-block rotate-1 rounded-md px-1.5 text-[10px] font-black text-white">
            1인 1장
          </span>
        </p>
        <p className="text-neo-text mt-2 text-xs leading-relaxed font-medium">
          랜덤 애니 캐릭터 아바타가 배정됩니다.
        </p>
        <p className="text-neo-text mt-2 text-xs leading-relaxed font-bold">
          피드백 및 인사말은 언제든 환영!
        </p>
      </>
    ),
  },
  {
    id: "renewal",
    content: (
      <>
        <p className="font-neo-heading text-neo-text text-lg leading-snug font-bold">
          Kyuniverse 페이지를
          <br />
          <span className="bg-neo-accent border-neo-border inline-block -rotate-1 rounded-md border-2 px-2 py-0.5">
            renewal 했습니다!
          </span>
        </p>
        <p className="text-neo-text mt-3 text-sm leading-relaxed font-semibold">
          이번 페이지의 컨셉은{" "}
          <span className="bg-neo-primary inline-block rotate-1 rounded-md px-1.5 font-black text-white">
            NEO BRUTALISM
          </span>
          입니다.
        </p>
        <a
          href="https://kyu-niverse.com/old/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neo-info mt-2 inline-block text-xs font-bold underline underline-offset-2"
        >
          이전의 페이지를 보고 싶으시다면? →
        </a>
      </>
    ),
  },
];

export default function NotificationAlert() {
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
      className={`font-neo border-neo-border shadow-neo-md absolute right-5 bottom-20 z-9998 w-[340px] overflow-hidden rounded-xl border-3 ${
        closing ? "neo-notification--closing" : "neo-notification--opening"
      }`}
    >
      {/* Title Bar */}
      <div className="bg-neo-warning border-neo-border flex items-center justify-between border-b-3 px-3 py-2">
        <div className="flex items-center gap-2">
          <Bell className="text-neo-text size-4" strokeWidth={3} />
          <span className="font-neo-heading text-neo-text text-xs font-bold tracking-wide">
            알림
          </span>
          <span className="bg-neo-info border-neo-border rounded-full border-2 px-1.5 py-0 text-[10px] leading-4 font-black text-white">
            {total}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="neo-btn bg-neo-primary border-neo-border flex size-6 cursor-pointer items-center justify-center rounded-md border-2 text-xs font-bold transition-transform duration-100"
          >
            <X className="size-3.5" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Carousel content */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className="bg-neo-surface min-w-0 flex-[0_0_100%] p-5"
            >
              {notif.content}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators + OK button */}
      <div className="bg-neo-surface px-5 pb-5">
        {/* Dots */}
        <div className="mb-3 flex justify-center gap-1.5">
          {NOTIFICATIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`size-2 cursor-pointer rounded-full border-2 border-black transition-all ${
                i === currentIndex ? "bg-neo-info w-5" : "bg-neo-surface"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleClose}
          className="neo-btn bg-neo-secondary border-neo-border shadow-neo-sm w-full cursor-pointer rounded-lg border-2 py-2 text-sm font-extrabold tracking-wide transition-transform duration-100"
        >
          OK, GOT IT
        </button>
      </div>
    </div>
  );
}
