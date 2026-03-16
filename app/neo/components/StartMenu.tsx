"use client";

import { type ReactNode } from "react";
import {
  useWindowState,
  useOverlayState,
  DESKTOP_ITEMS,
  getDesktopItem,
} from "./WindowManager";
import BlogIcon from "./icons/BlogIcon";
import InstagramIcon from "./icons/InstagramIcon";
import GamesIcon from "./icons/GamesIcon";

const START_MENU_ICONS: Record<string, ReactNode> = {
  blog: <BlogIcon size={20} />,
  instagram: <InstagramIcon size={20} />,
  games: <GamesIcon size={20} />,
};

export default function StartMenu() {
  const { openWindow } = useWindowState();
  const { setStartMenuOpen } = useOverlayState();
  const handleClick = (id: string) => {
    openWindow(id);
    setStartMenuOpen(false);
  };

  return (
    <div className="neo-start-menu--open bg-neo-surface border-neo-border shadow-neo-lg font-neo-heading absolute bottom-14 left-2 z-[10000] flex w-[340px] flex-col overflow-hidden rounded-2xl border-3">
      {/* Header */}
      <div className="bg-neo-primary border-neo-border border-b-3 px-4.5 py-3.5">
        <span className="text-neo-text font-neo-heading text-base font-bold tracking-wide">
          🌌 KYU-NIVERSE
        </span>
      </div>

      <div className="neo-scrollbar flex max-h-[360px] flex-col gap-1 overflow-y-auto p-2.5">
        {DESKTOP_ITEMS.map((item) => {
          const itemColor = getDesktopItem(item.id)?.color ?? "#FF6B6B";
          return (
            <button
              key={item.id}
              className="neo-start-menu-item neo-btn bg-neo-surface border-neo-border shadow-neo-sm text-neo-text font-neo-heading flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-3 px-3 py-[18px] transition-all duration-100"
              style={{ "--hover-color": itemColor } as React.CSSProperties}
              onClick={() => handleClick(item.id)}
            >
              <span
                className="border-neo-border flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border-2 text-xl"
                style={{ background: itemColor }}
              >
                {START_MENU_ICONS[item.id] ?? item.icon}
              </span>
              <span className="text-[13px] font-semibold">
                {item.title.replace(".exe", "")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-neo-border border-t-3 p-2.5">
        <button
          className="neo-start-menu-item neo-btn bg-neo-surface border-neo-border shadow-neo-sm font-neo-heading text-neo-text flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-3 px-3 py-2 text-[13px] font-semibold transition-all duration-100"
          style={{ "--hover-color": "#FF6B6B" } as React.CSSProperties}
          onClick={() => {
            setStartMenuOpen(false);
            window.location.href = "/";
          }}
        >
          <span className="text-base">⏻</span>
          <span>시스템 종료</span>
        </button>
      </div>
    </div>
  );
}
