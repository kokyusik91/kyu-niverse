"use client";

import { useRef, useCallback, type MouseEvent } from "react";

interface UseDragOptions {
  onDragStart?: (e: MouseEvent) => { startX: number; startY: number } | null;
  onDragMove?: (dx: number, dy: number) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
}

export function useDrag({ onDragStart, onDragMove, onDragEnd, disabled }: UseDragOptions) {
  const dragOrigin = useRef<{ startX: number; startY: number } | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled) return;
    const origin = onDragStart?.(e);
    if (!origin) return;
    dragOrigin.current = origin;

    const handleMouseMove = (ev: globalThis.MouseEvent) => {
      if (!dragOrigin.current) return;
      const dx = ev.clientX - dragOrigin.current.startX;
      const dy = ev.clientY - dragOrigin.current.startY;
      onDragMove?.(dx, dy);
    };
    const handleMouseUp = () => {
      dragOrigin.current = null;
      onDragEnd?.();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [disabled, onDragStart, onDragMove, onDragEnd]);

  return { handleMouseDown };
}
