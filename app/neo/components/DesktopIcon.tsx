"use client";

import { useRef, useCallback, type MouseEvent, type ReactNode } from "react";
import { useWindowState, useIconState, getDesktopItem } from "./WindowManager";
import ResumeIcon from "./icons/ResumeIcon";
import BlogIcon from "./icons/BlogIcon";
import BookstoreIcon from "./icons/BookstoreIcon";
import InstagramIcon from "./icons/InstagramIcon";
import GamesIcon from "./icons/GamesIcon";

const CUSTOM_ICONS: Record<string, ReactNode> = {
  resume: <ResumeIcon />,
  blog: <BlogIcon />,
  bookstore: <BookstoreIcon />,
  instagram: <InstagramIcon />,
  games: <GamesIcon />,
};

interface DesktopIconProps {
  id: string;
  icon: string;
  title: string;
}

const DRAG_THRESHOLD = 5;
const ICON_WIDTH = 80;
const ICON_HEIGHT = 86;
export { ICON_WIDTH, ICON_HEIGHT };

export default function DesktopIcon({ id, icon, title }: DesktopIconProps) {
  const { openWindow } = useWindowState();
  const {
    iconPositions,
    updateIconPositions,
    selectedIcons,
    setSelectedIcons,
  } = useIconState();
  const dragRef = useRef<{
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const pos = iconPositions[id] ?? { x: 0, y: 0 };
  const isSelected = selectedIcons.has(id);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let newSelection: Set<string>;
      if (e.ctrlKey || e.metaKey) {
        newSelection = new Set(selectedIcons);
        if (newSelection.has(id)) newSelection.delete(id);
        else newSelection.add(id);
      } else if (selectedIcons.has(id)) {
        newSelection = selectedIcons;
      } else {
        newSelection = new Set([id]);
      }
      setSelectedIcons(newSelection);
      const dragIds = Array.from(newSelection);
      const startPositions: Record<string, { x: number; y: number }> = {};
      for (const did of dragIds) {
        const p = iconPositions[did];
        if (p) startPositions[did] = { x: p.x, y: p.y };
      }
      dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        if (
          !dragRef.current.moved &&
          Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD
        )
          dragRef.current.moved = true;
        if (dragRef.current.moved) {
          const updates: Record<string, { x: number; y: number }> = {};
          for (const did of dragIds) {
            const sp = startPositions[did];
            if (sp) updates[did] = { x: sp.x + dx, y: sp.y + dy };
          }
          updateIconPositions(updates);
        }
      };
      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id, iconPositions, updateIconPositions, selectedIcons, setSelectedIcons],
  );

  const handleDoubleClick = useCallback(() => {
    openWindow(id);
  }, [id, openWindow]);

  const item = getDesktopItem(id);
  const bgClass = item?.bgClass ?? "bg-neo-primary";
  const bgHex = item?.color ?? "#FF6B6B";

  return (
    <button
      className="neo-desktop-icon font-neo-heading text-neo-text absolute flex w-20 cursor-pointer flex-col items-center gap-1.5 rounded-xl border-3 border-transparent bg-transparent shadow-none px-1 pt-2 pb-1.5 data-[selected=true]:border-[#1A1A2E] data-[selected=true]:[box-shadow:3px_3px_0px_0px_#1A1A2E] data-[selected=true]:bg-[var(--icon-bg)]"
      data-icon-id={id}
      data-selected={isSelected}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{ left: pos.x, top: pos.y, "--icon-bg": bgHex } as React.CSSProperties}
    >
      <span
        className={`${bgClass} border-neo-border shadow-neo-sm pointer-events-none flex h-12 w-12 items-center justify-center rounded-xl border-3 text-[28px]`}
      >
        {CUSTOM_ICONS[id] ?? icon}
      </span>
      <span className="font-neo-heading text-neo-text pointer-events-none text-center text-[11px] leading-tight font-semibold break-all">
        {title}
      </span>
    </button>
  );
}
