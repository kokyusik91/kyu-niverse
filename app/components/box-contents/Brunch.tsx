"use client";

import { BRUNCH_URL } from "@/app/constants/external-url";
import { useColor } from "@/app/providers/ColorProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

export default function Brunch() {
  const { generateColor, generateTextColor } = useColor();
  const { hasDescription } = useDesciption();
  const [brunch, setBrunch] = useState(false);

  const handleBrunch = () => {
    setBrunch(true);
  };
  const handleBrunch2 = () => {
    setBrunch(false);
  };

  return (
    <Link
      href={BRUNCH_URL}
      target="_blank"
      onMouseEnter={handleBrunch}
      onMouseLeave={handleBrunch2}
      className={`target relative inline-flex min-h-44 grow flex-col transition-all ${generateColor(
        "bg-zinc-800",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>
        <div className="text-center">
          <Image
            className={`z-50 mb-3 transition-all duration-1000 ${
              brunch ? "translate-x-0" : "translate-x-[-1000px]"
            } ${brunch ? "rotate-0" : "rotate-180"} ${
              brunch ? "opacity-1" : "opacity-0"
            }`}
            src={"/brunch.svg"}
            width={119}
            height={160}
            alt="brunch logo"
          />
          <h1
            className={`text-lg font-bold transition-all duration-1000 ${
              brunch ? "translate-x-0" : "translate-x-[200px]"
            } ${brunch ? "rotate-0" : "rotate-180"} ${generateTextColor("white")}`}
          >
            Brunch
          </h1>
        </div>
        <h1
          className={`${
            brunch ? "opacity-0" : "opacity-1"
          } absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 transform text-5xl transition-all`}
        >
          ✍️
        </h1>
      </OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          브런치 ✒️
        </h1>
        <p>
          평소 생활하며 잔잔하게 얻은 인사이트를 종종 적고 있습니다
          <br /> 브런치 로고만 넣으면, 너무 심심해보여 잔잔한 애니메이션을 넣어
          보았습니다! 역시나 눌렀을때 저의 브런치로 이동합니다! 🚀
        </p>
      </DescriptionContents>
    </Link>
  );
}
