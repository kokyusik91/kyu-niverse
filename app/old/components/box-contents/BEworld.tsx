"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useColor } from "@/app/old/providers/ColorProvider";
import { BEWORLD_NOTION_URL } from "@/app/constants/external-url";
import OriginalContents from "../OriginalContents";
import DescriptionContents from "../DescriptionContents";
import { useDesciption } from "@/app/old/providers/DescriptionProvider";

type BEworldProps = {
  children: ReactNode;
};

export default function BEworld({ children }: BEworldProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <Link
      href={BEWORLD_NOTION_URL}
      target="_blank"
      className={`target min-h-56 grow transition-all lg:h-full ${generateColor(
        "bg-violet-400",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          KYU&apos;S BE World 🗺️
        </h1>
        <p>
          는 프론트엔드 개발자이지만, 다양한 분야에 관심이 있습니다. 이게
          좋은걸까요? 안 좋은걸까요? 뭐 정답은 없으니깐요 ㅋㅋ 하지만 제가
          백엔드 공부를 시작한것은 사실 <strong>Next.js</strong>라는 친구
          때문입니다.
        </p>
      </DescriptionContents>
    </Link>
  );
}
