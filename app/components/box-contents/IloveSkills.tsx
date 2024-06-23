"use client";

import React, { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import OriginalContents from "../OriginalContents";
import DescriptionContents from "../DescriptionContents";

type IloveProps = {
  children: ReactNode;
};

export default function IloveSkills({ children }: IloveProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <div
      className={`target relative min-h-44 grow p-3 transition-all ${generateColor(
        "bg-zinc-800",
      )} `}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          I LOVE 😘
        </h1>
        <p>
          제가 좋아하는 여러가지 기술들 입니다. 기술 로고 위에 마우스를
          올려보시면(모바일에서는 터치👆🏻), 이름이 스르륵 출현해요!
        </p>
      </DescriptionContents>
    </div>
  );
}
