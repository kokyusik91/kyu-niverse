'use client';

import { GITHUB_URL } from '@/app/constants/external-url';
import { useColor } from '@/app/providers/ColorProvider';
import Link from 'next/link';
import { ReactNode } from 'react';

type GithubProps = {
  children: ReactNode;
};

export default function Github({ children }: GithubProps) {
  const { generateColor } = useColor();

  return (
    <Link
      href={GITHUB_URL}
      target='_blank'
      className={`relative target grow transition-all ${generateColor(
        'bg-fuchsia-400'
      )}`}
    >
      {children}
    </Link>
  );
}
