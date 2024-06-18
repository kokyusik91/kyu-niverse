"use client";

import React, { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";

type IloveProps = {
  children: ReactNode;
};

export default function IloveSkills({ children }: IloveProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target relative grow p-3 transition-all ${generateColor(
        "bg-slate-800",
      )} `}
    >
      {children}
    </div>
  );
}
