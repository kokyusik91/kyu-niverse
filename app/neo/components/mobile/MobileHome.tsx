"use client";

import { DESKTOP_ITEMS } from "../WindowManager";
import { Menu } from "lucide-react";

const MOBILE_APPS = DESKTOP_ITEMS.map((item) => ({
  id: item.id,
  title: item.title.replace(".exe", ""),
  icon: item.icon,
  color: item.color,
}));

export default function MobileHome({
  onOpenApp,
}: {
  onOpenApp: (appId: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <h1 className="font-neo-heading text-neo-text text-lg font-bold tracking-tight">
          KYU-NIVERSE
        </h1>
        <button
          type="button"
          className="neo-btn border-neo-border bg-neo-surface flex size-10 items-center justify-center rounded-xl border-3 shadow-[3px_3px_0px_0px_#1A1A2E]"
        >
          <Menu className="text-neo-text size-5" strokeWidth={3} />
        </button>
      </div>

      {/* App Grid */}
      <div className="flex-1 px-6 pt-6">
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {MOBILE_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              className="flex flex-col items-center gap-2"
              onClick={() => onOpenApp(app.id)}
            >
              <div
                className="border-neo-border flex size-16 items-center justify-center rounded-2xl border-3"
                style={{
                  background: app.color,
                  boxShadow: "3px 3px 0px 0px #1A1A2E",
                }}
              >
                <span className="text-2xl">{app.icon}</span>
              </div>
              <span className="font-neo-heading text-neo-text text-[11px] font-bold">
                {app.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
