'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useColor } from '@/app/providers/ColorProvider';
import { FEWORLD_NOTION_URL } from '@/app/constants/external-url';

type FEWorldProps = {
  children: ReactNode;
};

export default function FEworld({ children }: FEWorldProps) {
  const { generateColor } = useColor();

  return (
    <Link
      href={FEWORLD_NOTION_URL}
      target='_blank'
      className={`target relative w-3/6 h-full transition-all ${generateColor(
        'bg-yellow-400'
      )}`}
    >
      {children}
    </Link>
  );
}
