"use client";

import { ReactNode, use } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type ActivityProps = {
  children: ReactNode;
};

export default function Activity({ children }: ActivityProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <div
      className={`target p-6 transition-all ${generateColor(
        "bg-gradient-to-r from-indigo-300 to-green-200",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          액티비티 🏋🏻‍♀️🧗🏻‍♀️
        </h1>
        <p>
          활동적인 그리고 몸을 쓰는 액티비티들을 시도하고 있어요. 그 중 하나가
          웨이트, 그리고 최근에 관심을 가지고 종종 지인,회사 분들과 같이가는
          클라이밍입니다! 💪🏻
        </p>
      </DescriptionContents>
    </div>
  );
}
