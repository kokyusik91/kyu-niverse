"use client";

import React, { ReactNode } from "react";
import { useColor } from "@/app/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type BookStoreProps = {
  children: ReactNode;
};

export default function BookStore({ children }: BookStoreProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <div
      // className={`target relative w-1/2 transition-all ${generateColor(
      //   "bg-gradient-to-r from-blue-400 to-green-200",
      // )}`}
      className={`target relative transition-all md:w-full lg:w-1/2 ${generateColor("bg-slate-800")}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          북 슬라이더 📚
        </h1>
        <p>
          책을 읽으면 정리하고 싶은 습관이 있습니다. 책을 한번 읽으면 거의
          절반은 기억이 안나는것에 답답함을 느껴, 그때부터 책을 읽으며
          공부한다는 마음으로 책 내용을 정리하기 시작했습니다.
          <br /> 살짝 부담이 되긴하지만, 나중에 이 요약본을 읽었을때 금방 기억을
          찾을 수 있다는 장점을 얻을수 있죠. <br /> 한 때는 이 요약본들을 PDF로
          말아 당근마켓에 무료나눔으로 올린적이 있었는데, 많은 분들이 관심을
          갖고 찾아주셨어요 😁 그 당시 감사하다는 말을 많이 들었는데, 참
          뿌듯하더라고요! <br />
          그래서 이때까지 읽었던 책들을 슬라이드 형식의 UI로 표현했어요. 추가로
          해당 책을 누를시 책 요약본으로 이동합니다! 🚀
        </p>
      </DescriptionContents>
    </div>
  );
}
