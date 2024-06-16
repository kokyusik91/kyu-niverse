'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type EmptyProps = {
  children: ReactNode;
};

export default function Empty({ children }: EmptyProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target grow h-full transition-all ${generateColor(
        'bg-zinc-400'
      )}`}
    >
      {children}
    </div>
  );
}
