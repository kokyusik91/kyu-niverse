'use client';

import { useColor } from '@/app/providers/ColorProvider';
import { ReactNode } from 'react';

type GithubProps = {
  children: ReactNode;
};

export default function Github({ children }: GithubProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target grow transition-all ${generateColor(
        'bg-fuchsia-400'
      )}`}
    >
      {children}
    </div>
  );
}
