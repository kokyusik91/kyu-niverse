"use client";

import {
  useWindowState,
  useOverlayState,
  getDesktopItem,
} from "./WindowManager";
import { useClock } from "../hooks/useClock";
import StartMenu from "./StartMenu";
import { Volume2 } from "lucide-react";

export default function Taskbar() {
  const { windows, focusWindow } = useWindowState();
  const { startMenuOpen, setStartMenuOpen } = useOverlayState();
  const time = useClock();

  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <>
      {startMenuOpen && <StartMenu />}
      <div className="bg-neo-surface border-neo-border font-neo-heading absolute right-0 bottom-0 left-0 z-[9999] flex h-12 items-center gap-1.5 border-t-3 px-2">
        <button
          className="neo-btn border-neo-border text-neo-text flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border-3 px-3.5 text-sm font-bold transition-transform duration-100"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          style={{
            background: startMenuOpen ? "#FF6B6B" : "#FFE66D",
            boxShadow: startMenuOpen ? "none" : "3px 3px 0px 0px #1A1A2E",
            transform: startMenuOpen ? "translate(2px, 2px)" : "none",
          }}
        >
          <span className="text-lg">🌌</span>
          <span className="font-neo-heading">시작</span>
        </button>

        <div className="bg-neo-border h-7 w-[3px] rounded-sm" />

        <div className="flex flex-1 gap-1 overflow-hidden">
          {openWindows.map((w) => (
            <button
              key={w.id}
              className="neo-btn border-neo-border text-neo-text font-neo-heading flex h-[34px] max-w-[180px] cursor-pointer items-center gap-1.5 overflow-hidden rounded-[10px] border-3 px-2.5 text-xs font-semibold text-ellipsis whitespace-nowrap transition-transform duration-100"
              onClick={() => focusWindow(w.id)}
              style={{
                background: w.isMinimized
                  ? "#FFFFFF"
                  : getDesktopItem(w.id)?.color ?? "#FF6B6B",
                boxShadow: w.isMinimized ? "2px 2px 0px 0px #1A1A2E" : "none",
                transform: w.isMinimized ? "none" : "translate(1px, 1px)",
              }}
            >
              <span className="text-sm">{w.icon}</span>
              <span>{w.title}</span>
            </button>
          ))}
        </div>

        <div className="bg-neo-secondary border-neo-border shadow-neo-sm font-neo-heading text-neo-text flex h-[34px] items-center gap-2 rounded-[10px] border-3 px-3 text-xs font-semibold">
          <Volume2 className="size-4" />
          <span className="tabular-nums">{time}</span>
        </div>
      </div>
    </>
  );
}
