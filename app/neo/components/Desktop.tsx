"use client";

import {
  useWindowState,
  useIconState,
  useOverlayState,
  DESKTOP_ITEMS,
  ICON_GRID_COL_SIZE,
  ICON_GRID_ROW_SIZE,
  ICON_GRID_PADDING_X,
  ICON_GRID_PADDING_Y,
  TASKBAR_HEIGHT,
  getRect,
  rectsOverlap,
  type SelectionBox,
} from "./WindowManager";
import DesktopIcon, { ICON_WIDTH, ICON_HEIGHT } from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import MenuBar from "./MenuBar";
import {
  ResumeContent,
  GithubContent,
  PlaceholderContent,
} from "./WindowContents";
import BlogContent from "./BlogContent";
import BookstoreContent from "./bookstore/BookstoreContent";
import InstagramContent from "./instagram/InstagramContent";
import GamesContent from "./games/GamesContent";
import type { BlogPostData } from "./NeoDesktop";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import {
  Suspense,
  useState,
  useRef,
  useCallback,
  useEffect,
  type MouseEvent,
} from "react";
import {
  ArrowDownUp,
  RefreshCw,
  ClipboardPaste,
  ClipboardCheck,
  FolderPlus,
  Folder,
  ExternalLink,
  FileText,
  Settings,
} from "lucide-react";

function getWindowContent(
  id: string,
  blogPosts: BlogPostData[],
  initialPostSlug?: string,
  books?: { id: string; coverUrl: string; title: string }[],
) {
  switch (id) {
    case "resume":
      return <ResumeContent />;
    case "github":
      return <GithubContent />;
    case "blog":
      return (
        <Suspense>
          <BlogContent posts={blogPosts} initialPostSlug={initialPostSlug} />
        </Suspense>
      );
    case "bookstore":
      return <BookstoreContent books={books ?? []} />;
    case "instagram":
      return <InstagramContent />;
    case "games":
      return <GamesContent />;
    default: {
      const item = DESKTOP_ITEMS.find((d) => d.id === id);
      return (
        <PlaceholderContent
          title={item?.title ?? id}
          icon={item?.icon ?? "📁"}
        />
      );
    }
  }
}

// --- Hooks ---

function useDesktopSelection(
  setSelectedIcons: (ids: Set<string>) => void,
  iconPositionsRef: React.MutableRefObject<
    Record<string, { x: number; y: number }>
  >,
) {
  const [selection, setSelection] = useState<SelectionBox | null>(null);
  const selectionActive = useRef(false);
  const wasDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractiveElement =
        target.closest("[data-icon-id]") ||
        target.closest("[data-neo-window]") ||
        target.closest("[data-taskbar]") ||
        target.closest("[data-menubar]");
      if (isInteractiveElement) return;

      setSelectedIcons(new Set());
      wasDragging.current = false;

      const box: SelectionBox = {
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      };
      setSelection(box);
      selectionActive.current = true;

      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        if (!selectionActive.current) return;
        wasDragging.current = true;

        box.currentX = ev.clientX;
        box.currentY = ev.clientY;
        setSelection({ ...box });

        const positions = iconPositionsRef.current;
        const rect = getRect(box);
        const ids = new Set<string>();
        for (const item of DESKTOP_ITEMS) {
          const pos = positions[item.id];
          if (!pos) continue;
          if (
            rectsOverlap(
              rect.x,
              rect.y,
              rect.w,
              rect.h,
              pos.x,
              pos.y,
              ICON_WIDTH,
              ICON_HEIGHT,
            )
          ) {
            ids.add(item.id);
          }
        }
        setSelectedIcons(ids);
      };

      const handleMouseUp = () => {
        selectionActive.current = false;
        setSelection(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [setSelectedIcons, iconPositionsRef],
  );

  const selRect = selection ? getRect(selection) : null;

  return { selRect, wasDragging, handleMouseDown };
}

function DesktopContextMenu({
  autoArrange,
  onToggleAutoArrange,
  onArrangeByName,
  onArrangeByType,
  onRefresh,
}: {
  autoArrange: boolean;
  onToggleAutoArrange: () => void;
  onArrangeByName: () => void;
  onArrangeByType: () => void;
  onRefresh: () => void;
}) {
  return (
    <ContextMenuContent className="bg-neo-surface border-neo-border shadow-neo-md font-neo text-neo-text min-w-[200px] rounded-xl border-3 p-1 text-[13px] font-semibold">
      <ContextMenuSub>
        <ContextMenuSubTrigger className="rounded-lg font-semibold">
          <ArrowDownUp className="mr-2 size-4" />
          아이콘 정렬
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="bg-neo-surface border-neo-border shadow-neo-md rounded-xl border-3 p-1">
          <ContextMenuItem
            onClick={onArrangeByName}
            className="rounded-lg font-semibold"
          >
            이름순
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onArrangeByType}
            className="rounded-lg font-semibold"
          >
            기본 정렬
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-neo-border h-[3px] rounded-sm" />
          <ContextMenuCheckboxItem
            checked={autoArrange}
            onCheckedChange={onToggleAutoArrange}
            className="rounded-lg font-semibold"
          >
            자동 정렬
          </ContextMenuCheckboxItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSeparator className="bg-neo-border h-[3px] rounded-sm" />

      <ContextMenuItem onClick={onRefresh} className="rounded-lg font-semibold">
        <RefreshCw className="mr-2 size-4" />
        새로 고침
      </ContextMenuItem>

      <ContextMenuSeparator className="bg-neo-border h-[3px] rounded-sm" />

      <ContextMenuItem disabled className="rounded-lg font-semibold">
        <ClipboardPaste className="mr-2 size-4" />
        붙여넣기
      </ContextMenuItem>
      <ContextMenuItem disabled className="rounded-lg font-semibold">
        <ClipboardCheck className="mr-2 size-4" />
        바로 가기 붙여넣기
      </ContextMenuItem>

      <ContextMenuSeparator className="bg-neo-border h-[3px] rounded-sm" />

      <ContextMenuSub>
        <ContextMenuSubTrigger className="rounded-lg font-semibold">
          <FolderPlus className="mr-2 size-4" />
          새로 만들기
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="bg-neo-surface border-neo-border shadow-neo-md rounded-xl border-3 p-1">
          <ContextMenuItem disabled className="rounded-lg font-semibold">
            <Folder className="mr-2 size-4" />
            폴더
          </ContextMenuItem>
          <ContextMenuItem disabled className="rounded-lg font-semibold">
            <ExternalLink className="mr-2 size-4" />
            바로 가기
          </ContextMenuItem>
          <ContextMenuItem disabled className="rounded-lg font-semibold">
            <FileText className="mr-2 size-4" />
            텍스트 문서
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSeparator className="bg-neo-border h-[3px] rounded-sm" />

      <ContextMenuItem className="rounded-lg font-semibold">
        <Settings className="mr-2 size-4" />
        속성
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

function SelectionOverlay({
  rect,
}: {
  rect: { x: number; y: number; w: number; h: number };
}) {
  const MIN_VISIBLE_SIZE = 4;
  if (rect.w + rect.h <= MIN_VISIBLE_SIZE) return null;

  return (
    <div
      className="border-neo-border pointer-events-none absolute z-5 rounded-lg border-3"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        background: "rgba(78, 205, 196, 0.15)",
      }}
    />
  );
}

export default function Desktop({
  blogPosts,
  initialPostSlug,
  books,
}: {
  blogPosts: BlogPostData[];
  initialPostSlug?: string;
  books?: { id: string; coverUrl: string; title: string }[];
}) {
  const { windows } = useWindowState();
  const { iconPositions, updateIconPosition, setSelectedIcons } =
    useIconState();
  const { setStartMenuOpen } = useOverlayState();

  const [autoArrange, setAutoArrange] = useState(false);
  const iconPositionsRef = useRef(iconPositions);
  useEffect(() => {
    iconPositionsRef.current = iconPositions;
  }, [iconPositions]);

  const {
    selRect,
    wasDragging,
    handleMouseDown: handleSelectionMouseDown,
  } = useDesktopSelection(setSelectedIcons, iconPositionsRef);

  const arrangeIcons = (items: typeof DESKTOP_ITEMS) => {
    const maxRows = Math.floor(
      (window.innerHeight - TASKBAR_HEIGHT) / ICON_GRID_ROW_SIZE,
    );
    items.forEach((item, i) => {
      const col = Math.floor(i / maxRows);
      const row = i % maxRows;
      updateIconPosition(
        item.id,
        ICON_GRID_PADDING_X + col * ICON_GRID_COL_SIZE,
        ICON_GRID_PADDING_Y + row * ICON_GRID_ROW_SIZE,
      );
    });
  };

  const handleDesktopClick = useCallback(
    (e: MouseEvent) => {
      if (wasDragging.current) {
        wasDragging.current = false;
        setStartMenuOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (!target.closest("[data-icon-id]")) setSelectedIcons(new Set());
      setStartMenuOpen(false);
    },
    [setSelectedIcons, setStartMenuOpen, wasDragging],
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          data-neo-desktop
          className="bg-neo-bg relative h-screen w-screen overflow-hidden select-none"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(26,26,46,0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(26,26,46,0.03) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(26,26,46,0.03) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(26,26,46,0.03) 75%)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
          onClick={handleDesktopClick}
          onMouseDown={handleSelectionMouseDown}
        >
          <MenuBar />

          {selRect && <SelectionOverlay rect={selRect} />}

          {DESKTOP_ITEMS.map((item) => (
            <DesktopIcon
              key={item.id}
              id={item.id}
              icon={item.icon}
              title={item.title}
            />
          ))}

          {windows.map((w) => (
            <Window key={w.id} windowState={w}>
              {getWindowContent(w.id, blogPosts, initialPostSlug, books)}
            </Window>
          ))}

          <div onClick={(e) => e.stopPropagation()} data-taskbar>
            <Taskbar />
          </div>
        </div>
      </ContextMenuTrigger>

      <DesktopContextMenu
        autoArrange={autoArrange}
        onToggleAutoArrange={() => setAutoArrange(!autoArrange)}
        onArrangeByName={() =>
          arrangeIcons(
            [...DESKTOP_ITEMS].sort((a, b) =>
              a.title.localeCompare(b.title, "ko"),
            ),
          )
        }
        onArrangeByType={() => arrangeIcons(DESKTOP_ITEMS)}
        onRefresh={() => window.location.reload()}
      />
    </ContextMenu>
  );
}
