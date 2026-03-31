"use client";

import {
  useRef,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  useWindowState,
  getDesktopItem,
  type WindowState,
} from "./WindowManager";
import { useDrag } from "../hooks/useDrag";
import BlogIcon from "./icons/BlogIcon";
import InstagramIcon from "./icons/InstagramIcon";
import GamesIcon from "./icons/GamesIcon";
import AnimeIcon from "./icons/AnimeIcon";

const WINDOW_ICONS: Record<string, ReactNode> = {
  blog: <BlogIcon size={18} />,
  instagram: <InstagramIcon size={18} />,
  games: <GamesIcon size={18} />,
  anime: <AnimeIcon size={18} />,
};

type AnimState = "opening" | "closing" | "minimizing" | "restoring" | "idle";

const CLOSE_ANIMATION_MS = 180;
const MINIMIZE_ANIMATION_MS = 250;

const ANIM_CLASS_MAP: Record<AnimState, string> = {
  opening: "neo-window--opening",
  closing: "neo-window--closing",
  minimizing: "neo-window--minimizing",
  restoring: "neo-window--restoring",
  idle: "",
};

function useWindowAnimation(isOpen: boolean, isMinimized: boolean) {
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [visible, setVisible] = useState(false);
  const prevOpen = useRef(isOpen);
  const prevMinimized = useRef(isMinimized);

  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      setVisible(true);
      setAnimState("opening");
    } else if (!isOpen && prevOpen.current) {
      setAnimState("closing");
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (isMinimized && !prevMinimized.current) {
      setAnimState("minimizing");
    } else if (!isMinimized && prevMinimized.current && isOpen) {
      setVisible(true);
      setAnimState("restoring");
    }
    prevMinimized.current = isMinimized;
  }, [isMinimized, isOpen]);

  const handleAnimEnd = useCallback(() => {
    if (animState === "closing" || animState === "minimizing") {
      setVisible(false);
    }
    setAnimState("idle");
  }, [animState]);

  const animClass = ANIM_CLASS_MAP[animState];

  return { visible, animState, animClass, handleAnimEnd, setAnimState };
}

function TitleBarButton({
  onClick,
  variant = "default",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "close";
  children: ReactNode;
}) {
  const bgClass = variant === "close" ? "bg-neo-primary" : "bg-neo-surface";
  return (
    <button
      className={`neo-btn flex h-8 w-8 items-center justify-center ${bgClass} border-neo-border shadow-neo-sm text-neo-text font-neo cursor-pointer rounded-lg border-3 text-sm font-bold transition-transform duration-100`}
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </button>
  );
}

interface WindowProps {
  windowState: WindowState;
  children: ReactNode;
}

export default function Window({ windowState, children }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
  } = useWindowState();
  const windowRef = useRef<HTMLDivElement>(null);
  const posAtDragStart = useRef(windowState.position);
  const { visible, animClass, handleAnimEnd, setAnimState } =
    useWindowAnimation(windowState.isOpen, windowState.isMinimized);

  const { handleMouseDown: handleTitleBarMouseDown } = useDrag({
    disabled: windowState.isMaximized,
    onDragStart: (e) => {
      focusWindow(windowState.id);
      posAtDragStart.current = windowState.position;
      return { startX: e.clientX, startY: e.clientY };
    },
    onDragMove: (dx, dy) => {
      updatePosition(
        windowState.id,
        posAtDragStart.current.x + dx,
        posAtDragStart.current.y + dy,
      );
    },
  });

  const handleClose = useCallback(() => {
    setAnimState("closing");
    setTimeout(() => closeWindow(windowState.id), CLOSE_ANIMATION_MS);
  }, [closeWindow, windowState.id, setAnimState]);

  const handleMinimize = useCallback(() => {
    setAnimState("minimizing");
    setTimeout(() => minimizeWindow(windowState.id), MINIMIZE_ANIMATION_MS);
  }, [minimizeWindow, windowState.id, setAnimState]);

  if (!visible && !windowState.isOpen) return null;
  if (!visible && windowState.isMinimized) return null;

  const posStyle = windowState.isMaximized
    ? {
        top: 28,
        left: 0,
        width: "100%",
        height: "calc(100% - 76px)",
        zIndex: windowState.zIndex,
      }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      };

  const titleBg = getDesktopItem(windowState.id)?.color ?? "#FF6B6B";

  return (
    <div
      ref={windowRef}
      data-neo-window
      className={`neo-window ${animClass} ${windowState.isMaximized ? "neo-window--maximizing" : ""} bg-neo-surface font-neo absolute overflow-hidden ${windowState.isMaximized ? "border-neo-border border-x-3" : "border-neo-border shadow-neo-lg border-3"}`}
      style={{ ...posStyle, borderRadius: windowState.isMaximized ? 0 : 12 }}
      onMouseDown={() => focusWindow(windowState.id)}
      onAnimationEnd={handleAnimEnd}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        className="border-neo-border flex h-11 items-center justify-between border-b-3 px-2.5 select-none"
        style={{
          background: titleBg,
          cursor: windowState.isMaximized ? "default" : "grab",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center text-lg">
            {WINDOW_ICONS[windowState.id] ?? windowState.icon}
          </span>
          <span className="text-neo-text font-neo-heading text-sm font-bold">
            {windowState.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TitleBarButton onClick={handleMinimize}>—</TitleBarButton>
          <TitleBarButton onClick={() => maximizeWindow(windowState.id)}>
            □
          </TitleBarButton>
          <TitleBarButton onClick={handleClose} variant="close">
            ✕
          </TitleBarButton>
        </div>
      </div>

      <div
        className="neo-scrollbar bg-neo-surface text-neo-text overflow-auto"
        style={{ height: "calc(100% - 44px)" }}
      >
        {children}
      </div>
    </div>
  );
}
