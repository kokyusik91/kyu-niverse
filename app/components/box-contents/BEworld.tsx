'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useColor } from '@/app/providers/ColorProvider';
import { BEWORLD_NOTION_URL } from '@/app/constants/external-url';

type BEworldProps = {
  children: ReactNode;
};

export default function BEworld({ children }: BEworldProps) {
  const { generateColor } = useColor();

  return (
    <Link
      href={BEWORLD_NOTION_URL}
      target='_blank'
      className={`target grow h-full transition-all ${generateColor(
        'bg-violet-400'
      )}`}
    >
      {children}
    </Link>
  );
}
