"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";

type ResumeProps = {
  children: ReactNode;
};

export default function Resume({ children }: ResumeProps) {
  const { generateColor } = useColor();

  return (
    <a
      href="/resume-kokyusik.pdf"
      target="_blank"
      rel="noopener noreferrer"
      download
      className={`target relative h-1/4 bg-gradient-to-r ${generateColor("from-blue-400 via-green-200 to-violet-200")} p-3 transition-all bg-400% animate-gradientbg`}
    >
      {children}
    </a>
  );
}
