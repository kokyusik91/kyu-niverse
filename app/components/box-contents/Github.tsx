"use client";

import { GITHUB_URL } from "@/app/constants/external-url";
import { useColor } from "@/app/providers/ColorProvider";
import Link from "next/link";
import { ReactNode } from "react";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type GithubProps = {
  children: ReactNode;
};

export default function Github({ children }: GithubProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <Link
      href={GITHUB_URL}
      target="_blank"
      className={`target relative min-h-44 grow transition-all ${generateColor(
        "bg-zinc-800",
      )}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-2xl font-extrabold text-zinc-900`}>
          Github 📁
        </h1>
        <p>이때까지 제가 끄적거렸던 레포지토리들을 보실 수 있어요! 🚀</p>
      </DescriptionContents>
    </Link>
  );
}
