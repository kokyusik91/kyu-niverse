"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import OriginalContents from "../OriginalContents";
import DescriptionContents from "../DescriptionContents";

type ResumeProps = {
  children: ReactNode;
};

export default function Resume({ children }: ResumeProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <a
      href="/resume-kokyusik.pdf"
      target="_blank"
      rel="noopener noreferrer"
      download
      className={`target relative inline-block h-1/4 min-h-44 p-3 transition-all ${generateColor("bg-zinc-800")}`}
      // className={`target relative h-1/4 bg-gradient-to-r ${generateColor("from-blue-400 via-green-200 to-violet-200")} animate-gradientbg bg-400% p-3 transition-all`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          Resume 📜
        </h1>
        <p>Figma로 만든 이력서를 PDF 형태로 다운받아 볼 수 있어요!</p>
      </DescriptionContents>
    </a>
  );
}
