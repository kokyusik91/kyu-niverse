"use client";

import { MEDIC_NOTION_URL } from "@/app/constants/external-url";
import Link from "next/link";
import { ReactNode } from "react";
import OriginalContents from "../OriginalContents";
import { useDesciption } from "@/app/providers/DescriptionProvider";
import DescriptionContents from "../DescriptionContents";

type MedicProps = {
  children: ReactNode;
};

export default function Medic({ children }: MedicProps) {
  const { hasDescription } = useDesciption();
  return (
    <Link
      href={""}
      target="_blank"
      className={`target inline-block min-h-44 grow bg-[url('/code.jpg')] bg-right-top transition-all`}
    >
      <OriginalContents isActive={hasDescription}>{children}</OriginalContents>
      <DescriptionContents isActive={hasDescription}>
        <h1 className={`mb-3 text-3xl font-extrabold text-zinc-900`}>
          코드 메딕 👩🏼‍⚕️
        </h1>
        <p>
          업무를 하며, 개인적으로 치료가 필요하고 생각했던 문제점들은 뭐가
          있었고, 이를 어떻게 치료할지 고민을 했던 글 들 입니다. <br />
          개발을 하며 불편한 것, 조금 이상하다고 생각이 드는 것들은 언젠가는
          해결해야할 문제라고 생각해요. 🤒
        </p>
      </DescriptionContents>
    </Link>
  );
}
