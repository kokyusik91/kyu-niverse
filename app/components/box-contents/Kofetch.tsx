"use client";

import { useState } from "react";
import Image from "next/image";
import { useColor } from "@/app/providers/ColorProvider";
import Link from "next/link";
import { KOFETCH_NPM_URL } from "@/app/constants/external-url";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

export default function Kofetch() {
  const { generateColor, generateTextColor } = useColor();
  const { hasDescription } = useDesciption();
  const [kofetch, setKofetch] = useState(false);

  const handleKofetch = () => {
    setKofetch(true);
  };

  const handleKofetch2 = () => {
    setKofetch(false);
  };

  return (
    <Link
      href={KOFETCH_NPM_URL}
      target="_blank"
      onMouseEnter={handleKofetch}
      onMouseLeave={handleKofetch2}
      className={`target inline-block min-h-32 transition-all lg:h-2/6 ${generateColor("bg-zinc-800")}`}
    >
      <OriginalContents isActive={hasDescription}>
        <div className="flex items-end">
          <h1
            className={`text-3xl font-extrabold ${generateTextColor("white")}`}
          >
            Ko
          </h1>
          <span
            className={`${
              kofetch ? "translate-x-0" : "translate-x-[300px]"
            } text-xl font-semibold transition-all duration-1000 ease-in-out ${generateTextColor("white")}`}
          >
            Fetch
          </span>
        </div>
        <Image
          className="ml-2"
          src="/npm.webp"
          width={120}
          height={60}
          alt="앤피엠"
        />
      </OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-2 text-3xl font-extrabold text-zinc-900`}>
          KoFetch 🛜
        </h1>
        <p>Web API중 하나인 fetch를 조금 더 쓰기 편하게 만들어 보았어요!</p>
      </DescriptionContents>
    </Link>
  );
}
