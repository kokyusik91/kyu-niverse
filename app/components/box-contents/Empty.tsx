"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type EmptyProps = {
  children: ReactNode;
};

export default function Empty({ children }: EmptyProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <div
      className={`target h-full grow p-4 transition-all ${generateColor(
        "bg-zinc-800",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          다음 🏋🏻‍♀️
        </h1>
        <p>집에 있는 은퇴한 맥북과 공유기로 홈서버를 구축 해보았어요! 💻</p>
      </DescriptionContents>
    </div>
  );
}
