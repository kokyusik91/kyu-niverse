'use client';

import { MEDIC_NOTION_URL } from '@/app/constants/external-url';
import Link from 'next/link';
import { ReactNode } from 'react';

type MedicProps = {
  children: ReactNode;
};

export default function Medic({ children }: MedicProps) {
  return (
    <Link
      href={MEDIC_NOTION_URL}
      target='_blank'
      className={`target grow transition-all bg-[url('/code.jpg')] bg-right-top	`}
    >
      {children}
    </Link>
  );
}
