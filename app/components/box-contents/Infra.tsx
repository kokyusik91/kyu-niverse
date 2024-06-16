'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { INFRA_NOTION_URL } from '@/app/constants/external-url';
import { useColor } from '@/app/providers/ColorProvider';

type InfraProps = {
  children: ReactNode;
};

export default function Infra({ children }: InfraProps) {
  const { generateColor } = useColor();

  return (
    <Link
      href={INFRA_NOTION_URL}
      target='_blank'
      className={`target grow transition-all ${generateColor('bg-sky-400')}`}
    >
      {children}
    </Link>
  );
}
