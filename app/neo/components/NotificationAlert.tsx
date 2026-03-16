"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

const NOTIFICATION_DELAY_MS = 1500;
const CLOSE_ANIMATION_MS = 200;

export default function NotificationAlert() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), NOTIFICATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), CLOSE_ANIMATION_MS);
  };

  if (!visible) return null;

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
          <span className="relative flex size-2.5">
            <span className="bg-neo-info absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-neo-info relative inline-flex size-2.5 rounded-full" />
          </span>
        </div>
        <button
          onClick={handleClose}
          className="neo-btn bg-neo-primary border-neo-border flex size-6 cursor-pointer items-center justify-center rounded-md border-2 text-xs font-bold transition-transform duration-100"
        >
          <X className="size-3.5" strokeWidth={3} />
        </button>
      </div>

      <div className="bg-neo-surface p-5">
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

        <button
          onClick={handleClose}
          className="neo-btn bg-neo-secondary border-neo-border shadow-neo-sm mt-4 w-full cursor-pointer rounded-lg border-2 py-2 text-sm font-extrabold tracking-wide transition-transform duration-100"
        >
          OK, GOT IT
        </button>
      </div>
    </div>
  );
}
