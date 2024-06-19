"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";

type ActivityProps = {
  children: ReactNode;
};

export default function Activity({ children }: ActivityProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target w-1/2 transition-all p-6 ${generateColor(
        "bg-gradient-to-r from-green-200 to-indigo-300",
      )}`}
    >
      {children}
    </div>
  );
}
