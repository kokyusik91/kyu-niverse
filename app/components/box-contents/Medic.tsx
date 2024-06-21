"use client";

import { MEDIC_NOTION_URL } from "@/app/constants/external-url";
import Link from "next/link";
import { ReactNode } from "react";

type MedicProps = {
  children: ReactNode;
};

export default function Medic({ children }: MedicProps) {
  return (
    <Link
      href={""}
      target="_blank"
      className={`target grow bg-[url('/code.jpg')] bg-right-top transition-all`}
    >
      {children}
    </Link>
  );
}
