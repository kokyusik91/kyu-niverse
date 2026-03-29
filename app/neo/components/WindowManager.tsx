"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowStateContextType {
  windows: WindowState[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

interface IconStateContextType {
  iconPositions: Record<string, { x: number; y: number }>;
  updateIconPosition: (id: string, x: number, y: number) => void;
  updateIconPositions: (
    updates: Record<string, { x: number; y: number }>,
  ) => void;
  selectedIcons: Set<string>;
  setSelectedIcons: (ids: Set<string>) => void;
}

interface OverlayStateContextType {
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
}

const WindowStateContext = createContext<WindowStateContextType | null>(null);
const IconStateContext = createContext<IconStateContextType | null>(null);
const OverlayStateContext = createContext<OverlayStateContextType | null>(null);

export const DESKTOP_ITEMS = [
  // TODO: 컨텐츠가 준비되면 추가할 예정.
  // { id: "resume", title: "이력서.exe", icon: "📄", color: "#FF6B6B", bgClass: "bg-neo-primary", defaultPos: { x: 200, y: 60 }, defaultSize: { width: 650, height: 480 } },
  {
    id: "blog",
    title: "블로그.exe",
    icon: "✏️",
    color: "#FFE66D",
    bgClass: "bg-neo-accent",
    defaultPos: { x: 300, y: 80 },
    defaultSize: { width: 900, height: 550 },
  },
  // TODO: 컨텐츠가 준비되면 추가할 예정.
  // { id: "bookstore", title: "서점.exe", icon: "📚", color: "#339AF0", bgClass: "bg-neo-info", defaultPos: { x: 120, y: 60 }, defaultSize: { width: 800, height: 560 } },
  {
    id: "instagram",
    title: "Instagram.exe",
    icon: "📸",
    color: "#8B5CF6",
    bgClass: "bg-purple-300",
    defaultPos: { x: 180, y: 70 },
    defaultSize: { width: 1000, height: 600 },
  },
  {
    id: "games",
    title: "게임.exe",
    icon: "🎮",
    color: "#FF922B",
    bgClass: "bg-neo-warning",
    defaultPos: { x: 240, y: 100 },
    defaultSize: { width: 960, height: 600 },
  },
  {
    id: "anime",
    title: "애니.exe",
    icon: "🎬",
    color: "#FF6B6B",
    bgClass: "bg-neo-primary",
    defaultPos: { x: 200, y: 80 },
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: "flight-radar",
    title: "Flight Radar.exe",
    icon: "✈️",
    color: "#339AF0",
    bgClass: "bg-neo-info",
    defaultPos: { x: 160, y: 60 },
    defaultSize: { width: 900, height: 560 },
    hideFromDesktop: true,
  },
  {
    id: "jetstream",
    title: "Jetstream.exe",
    icon: "🌊",
    color: "#4ECDC4",
    bgClass: "bg-neo-secondary",
    defaultPos: { x: 200, y: 80 },
    defaultSize: { width: 850, height: 540 },
    hideFromDesktop: true,
  },
  {
    id: "earthquake",
    title: "Earthquake.exe",
    icon: "🌍",
    color: "#FF922B",
    bgClass: "bg-neo-warning",
    defaultPos: { x: 180, y: 70 },
    defaultSize: { width: 860, height: 560 },
    hideFromDesktop: true,
  },
];

const DESKTOP_ITEMS_BY_ID = Object.fromEntries(
  DESKTOP_ITEMS.map((item) => [item.id, item]),
);
export function getDesktopItem(id: string) {
  return DESKTOP_ITEMS_BY_ID[id];
}

export const ICON_GRID_COL_SIZE = 90;
export const ICON_GRID_ROW_SIZE = 90;
export const ICON_GRID_PADDING_X = 16;
export const ICON_GRID_PADDING_Y = 32;
export const TASKBAR_HEIGHT = 48;

export function calcIconGrid(maxRows: number) {
  const positions: Record<string, { x: number; y: number }> = {};
  DESKTOP_ITEMS.forEach((item, i) => {
    const col = Math.floor(i / maxRows);
    const row = i % maxRows;
    positions[item.id] = {
      x: ICON_GRID_PADDING_X + col * ICON_GRID_COL_SIZE,
      y: ICON_GRID_PADDING_Y + row * ICON_GRID_ROW_SIZE,
    };
  });
  return positions;
}

export interface SelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function getRect(box: SelectionBox) {
  return {
    x: Math.min(box.startX, box.currentX),
    y: Math.min(box.startY, box.currentY),
    w: Math.abs(box.currentX - box.startX),
    h: Math.abs(box.currentY - box.startY),
  };
}

export function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function updateWindowById(
  prev: WindowState[],
  id: string,
  patch: Partial<WindowState>,
) {
  return prev.map((w) => (w.id === id ? { ...w, ...patch } : w));
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const topZIndexRef = useRef(10);

  const [windows, setWindows] = useState<WindowState[]>(
    DESKTOP_ITEMS.map((item) => ({
      id: item.id,
      title: item.title,
      icon: item.icon,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: item.defaultPos,
      size: item.defaultSize,
    })),
  );

  const openWindow = useCallback((id: string) => {
    topZIndexRef.current++;
    setWindows((prev) =>
      updateWindowById(prev, id, {
        isOpen: true,
        isMinimized: false,
        zIndex: topZIndexRef.current,
      }),
    );
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      updateWindowById(prev, id, {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      }),
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => updateWindowById(prev, id, { isMinimized: true }));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    topZIndexRef.current++;
    setWindows((prev) =>
      updateWindowById(prev, id, {
        zIndex: topZIndexRef.current,
        isMinimized: false,
      }),
    );
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => updateWindowById(prev, id, { position: { x, y } }));
  }, []);

  // Icon state
  const [iconPositions, setIconPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => calcIconGrid(8));
  useEffect(() => {
    const maxRows = Math.floor(
      (window.innerHeight - TASKBAR_HEIGHT) / ICON_GRID_ROW_SIZE,
    );
    setIconPositions(calcIconGrid(maxRows));
  }, []);
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());

  const updateIconPosition = useCallback((id: string, x: number, y: number) => {
    setIconPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);
  const updateIconPositions = useCallback(
    (updates: Record<string, { x: number; y: number }>) => {
      setIconPositions((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const windowStateValue = useMemo(
    () => ({
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updatePosition,
    }),
    [
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updatePosition,
    ],
  );

  const iconStateValue = useMemo(
    () => ({
      iconPositions,
      updateIconPosition,
      updateIconPositions,
      selectedIcons,
      setSelectedIcons,
    }),
    [iconPositions, updateIconPosition, updateIconPositions, selectedIcons],
  );

  const overlayStateValue = useMemo(
    () => ({
      startMenuOpen,
      setStartMenuOpen,
    }),
    [startMenuOpen],
  );

  return (
    <WindowStateContext.Provider value={windowStateValue}>
      <IconStateContext.Provider value={iconStateValue}>
        <OverlayStateContext.Provider value={overlayStateValue}>
          {children}
        </OverlayStateContext.Provider>
      </IconStateContext.Provider>
    </WindowStateContext.Provider>
  );
}

export function useWindowState() {
  const ctx = useContext(WindowStateContext);
  if (!ctx)
    throw new Error("useWindowState must be used within WindowManagerProvider");
  return ctx;
}

export function useIconState() {
  const ctx = useContext(IconStateContext);
  if (!ctx)
    throw new Error("useIconState must be used within WindowManagerProvider");
  return ctx;
}

export function useOverlayState() {
  const ctx = useContext(OverlayStateContext);
  if (!ctx)
    throw new Error(
      "useOverlayState must be used within WindowManagerProvider",
    );
  return ctx;
}
