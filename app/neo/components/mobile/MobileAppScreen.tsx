"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export default function MobileAppScreen({
  title,
  color,
  onBack,
  children,
}: {
  title: string;
  color: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Title Bar */}
      <div
        className="border-neo-border flex h-12 shrink-0 items-center gap-3 border-b-3 px-3"
        style={{ background: color }}
      >
        <button
          type="button"
          onClick={onBack}
          className="neo-btn border-neo-border bg-neo-surface flex size-8 items-center justify-center rounded-lg border-3 shadow-[2px_2px_0px_0px_#1A1A2E]"
        >
          <ArrowLeft className="text-neo-text size-4" strokeWidth={3} />
        </button>
        <span className="font-neo-heading text-neo-text text-sm font-bold">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
