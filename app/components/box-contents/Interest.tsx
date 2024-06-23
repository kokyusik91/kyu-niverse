"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type InterestProps = {
  children: ReactNode;
};

export default function Interest({ children }: InterestProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <div
      className={`target h-2/6 transition-all ${generateColor("bg-zinc-800")} p-10`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          관심사 롤링 배너 🗞️
        </h1>
        <p>
          평소에 관심있는 키워드를 돌아가면서 보여줘요!
          <br />
        </p>
      </DescriptionContents>
    </div>
  );
}
