"use client";

import { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type FashionProps = {
  children: ReactNode;
};

export default function Fashion({ children }: FashionProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();
  return (
    <div
      className={`target flex transition-all lg:w-3/5 ${generateColor(
        "bg-red-300",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          나만의 Closet 👖
        </h1>
        <p>
          옷 사는 것을 좋아해서 제가 평소에 관심있어하는 옷들을 모아 봤어요!
          <br />
          `좌/우 슬라이드`를 통해 어떤 조합이 어울릴지 고민해보곤 합니다. 🤔
          <br /> 얼굴로 이모지를 연령에 맞게 넣어봤는데, 빼고 싶다면 얼굴 위에
          있는 ❌ 버튼을 과감하게 눌러주세요!
        </p>
      </DescriptionContents>
    </div>
  );
}
