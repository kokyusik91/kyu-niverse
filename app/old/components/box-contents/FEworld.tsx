"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useColor } from "@/app/old/providers/ColorProvider";
import { FEWORLD_NOTION_URL } from "@/app/constants/external-url";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/old/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type FEWorldProps = {
  children: ReactNode;
};

export default function FEworld({ children }: FEWorldProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <Link
      href={FEWORLD_NOTION_URL}
      target="_blank"
      className={`target relative min-h-96 w-full transition-all lg:h-full lg:w-3/6 ${generateColor(
        "bg-yellow-400",
      )} p-10`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          KYU&apos;S FE World 🗺️
        </h1>
        <p>
          저의 프론트엔드 개발 시작부터 현재까지 그리고 앞으로도 공부를 하며
          필요하다고 생각한 지식들을 정리해 놓은{" "}
          <strong>대 기록 보관소📚</strong>
          입니다!
          <br />
          <br />
          처음에는 굉장히 작은 페이지 였는데, 시간이 지나면 지날수록 내용들이
          많아져 이제는 찾기도 어려운 지경에 이르렀습니다. 어떻게 조금 더
          인덱싱하기 쉬운 구조로 바꿔야지 하면서도 벌려놓은게 많다보니 못하고
          있네요 🥲
          <br /> <br /> 프론트엔드의 모든 지식은 아니지만, 이때까지 제가
          공부해온 내용들을 정리하고 있습니다.
        </p>
      </DescriptionContents>
    </Link>
  );
}
