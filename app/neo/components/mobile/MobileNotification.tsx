"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const NOTIFICATION_DELAY_MS = 1200;
const CLOSE_ANIMATION_MS = 200;

export default function MobileNotification() {
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
            <span className="relative flex size-2.5">
              <span className="bg-neo-info absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-neo-info relative inline-flex size-2.5 rounded-full" />
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="neo-btn bg-neo-primary border-neo-border flex size-6 items-center justify-center rounded-md border-2 text-xs font-bold"
          >
            <X className="size-3.5" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
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
          <button
            type="button"
            onClick={handleClose}
            className="neo-btn bg-neo-secondary border-neo-border shadow-neo-sm mt-3 w-full rounded-lg border-2 py-2 text-sm font-extrabold tracking-wide"
          >
            OK, GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
