"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useWindowState, DESKTOP_ITEMS } from "./WindowManager";
import { PenLine, Globe, Settings, Plane, Waves, Activity } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";

interface MenuItemBase {
  label: string;
  icon?: ReactNode;
  action?: string;
  children?: MenuNode[];
  disabled?: boolean;
}
interface MenuSeparator {
  type: "separator";
}
interface MenuHeader {
  type: "header";
  label: string;
}
type MenuNode = MenuItemBase | MenuSeparator | MenuHeader;
interface TopMenu {
  label: string;
  children: MenuNode[];
}

const MENU_ITEMS: TopMenu[] = [
  {
    label: "프로필",
    children: [
      {
        label: "GitHub",
        icon: <GithubIcon size={16} className="text-[#333]" />,
        action: "https://github.com/kokyusik91",
      },
      { type: "separator" },
      { label: "시스템 종료...", action: "exit" },
    ],
  },
  {
    label: "콘텐츠",
    children: [
      {
        label: "브런치",
        icon: <PenLine className="size-4 text-[#00C853]" />,
        action: "https://brunch.co.kr/@jscrop",
      },
    ],
  },
  {
    label: "개발",
    children: [
      {
        label: "프론트엔드",
        children: [
          {
            label: "FE World",
            icon: <Globe className="text-neo-info size-4" />,
            action:
              "https://jamsilcrops-library.notion.site/kyusik-s-FE-World-d6077115dfaa4e66bbf60316183d7b60?pvs=4",
            disabled: true,
          },
        ],
      },
      {
        label: "백엔드",
        children: [
          {
            label: "BE World",
            icon: <Settings className="text-neo-warning size-4" />,
            action:
              "https://jamsilcrops-library.notion.site/kyusik-s-BE-World-ed1f4b6b63ef4dadb54c381c68ed49f8",
          },
        ],
      },
    ],
  },
  {
    label: "Playground",
    children: [
      {
        label: "Flight Radar",
        icon: <Plane className="text-neo-info size-4" />,
        action: "flight-radar",
      },
      // {
      //   label: "Jetstream",
      //   icon: <Waves className="size-4 text-neo-secondary" />,
      //   action: "jetstream",
      // },
      { type: "separator" },
      {
        label: "Earthquake",
        icon: <Activity className="size-4 text-[#FF922B]" />,
        action: "earthquake",
      },
    ],
  },
];

const panelClasses =
  "absolute min-w-[180px] bg-neo-surface border-3 border-neo-border rounded-xl p-1 z-[9999] font-neo-heading text-[13px] shadow-neo-md";

function SubMenuItem({
  item,
  onAction,
  onClose,
}: {
  item: MenuItemBase;
  onAction: (a: string) => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const highlighted = hovered || subOpen;
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setHovered(true);
        if (hasChildren) setSubOpen(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setSubOpen(false);
      }}
    >
      <button
        disabled={item.disabled}
        onClick={() => {
          if (item.action && !item.disabled) {
            onAction(item.action);
            onClose();
          }
        }}
        className="font-inherit text-neo-text flex w-full cursor-default items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] font-semibold transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: highlighted && !item.disabled ? "#FFE66D" : "transparent",
          border: highlighted && !item.disabled ? "2px solid #1A1A2E" : "2px solid transparent",
          boxShadow: "none",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <span className="flex items-center gap-1.5">
          {item.icon && item.icon}
          {item.label}
        </span>
        {hasChildren && <span className="ml-3 text-[10px]">▶</span>}
      </button>
      {hasChildren && subOpen && (
        <div
          className={`neo-menu-dropdown ${panelClasses}`}
          style={{ top: -4, left: "100%", marginLeft: 2 }}
        >
          {item.children!.map((child, i) => (
            <MenuNodeRenderer
              key={i}
              node={child}
              onAction={onAction}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuNodeRenderer({
  node,
  onAction,
  onClose,
}: {
  node: MenuNode;
  onAction: (a: string) => void;
  onClose: () => void;
}) {
  if ("type" in node && node.type === "separator")
    return <div className="bg-neo-border mx-1.5 my-1 h-[3px] rounded-sm" />;
  if ("type" in node && node.type === "header")
    return (
      <div className="px-2.5 py-1.5 pt-1.5 pb-0.5 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
        {node.label}
      </div>
    );
  return (
    <SubMenuItem
      item={node as MenuItemBase}
      onAction={onAction}
      onClose={onClose}
    />
  );
}

function MenuDropdown({
  menu,
  isOpen,
  onAction,
  onClose,
}: {
  menu: TopMenu;
  isOpen: boolean;
  onAction: (a: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className={`neo-menu-dropdown ${panelClasses}`}
      style={{ top: "calc(100% + 4px)", left: 0 }}
    >
      {menu.children.map((node, i) => (
        <MenuNodeRenderer
          key={i}
          node={node}
          onAction={onAction}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

export default function MenuBar() {
  const { openWindow } = useWindowState();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);

  const handleAction = useCallback(
    (action: string) => {
      if (action === "exit") {
        window.location.href = "/";
        return;
      }
      if (action.startsWith("https://")) {
        window.open(action, "_blank", "noopener,noreferrer");
        return;
      }
      const item = DESKTOP_ITEMS.find((d) => d.id === action);
      if (item) openWindow(action);
    },
    [openWindow],
  );
  const handleClose = useCallback(() => {
    setOpenMenu(null);
    setHovering(false);
  }, []);

  return (
    <div
      data-menubar
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="bg-neo-accent border-neo-border font-neo-heading absolute top-0 right-0 left-0 z-50 flex h-7 items-center justify-between border-b-3 px-2 text-[13px] select-none"
    >
      <div className="flex items-center gap-0">
        <span className="px-1.5 py-0.5 pl-1 text-sm">🌌</span>
        {MENU_ITEMS.map((menu, i) => (
          <div key={i} className="relative">
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                if (openMenu === i) {
                  setOpenMenu(null);
                  setHovering(false);
                } else {
                  setOpenMenu(i);
                  setHovering(true);
                }
              }}
              onMouseEnter={() => {
                if (hovering && openMenu !== null) setOpenMenu(i);
              }}
              className="font-inherit text-neo-text cursor-default rounded-md px-2 py-0.5 text-[13px] font-semibold transition-colors duration-100"
              style={{
                background: openMenu === i ? "#FFE66D" : "transparent",
                border:
                  openMenu === i
                    ? "2px solid #1A1A2E"
                    : "2px solid transparent",
                boxShadow: "none",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              {menu.label}
            </button>
            <MenuDropdown
              menu={menu}
              isOpen={openMenu === i}
              onAction={handleAction}
              onClose={handleClose}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
