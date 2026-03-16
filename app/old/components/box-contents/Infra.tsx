"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { INFRA_NOTION_URL } from "@/app/constants/external-url";
import { useColor } from "@/app/old/providers/ColorProvider";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/old/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type InfraProps = {
  children: ReactNode;
};

export default function Infra({ children }: InfraProps) {
  const { generateColor } = useColor();
  const { hasDescription } = useDesciption();

  return (
    <Link
      href={INFRA_NOTION_URL}
      target="_blank"
      className={`target grow p-10 transition-all ${generateColor("bg-emerald-200")}`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          홈 서버 프로젝트 💻
        </h1>
        <p>집에 있는 은퇴한 맥북과 공유기로 홈서버를 구축 해보았어요! 💻</p>
      </DescriptionContents>
    </Link>
  );
}
