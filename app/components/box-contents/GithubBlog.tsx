'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type GithubBlogProps = {
  children: ReactNode;
};

export default function GithubBlog({ children }: GithubBlogProps) {
  const { generateColor } = useColor();
  return (
    <div
      className={`target h-1/4 transition-all ${generateColor('bg-slate-400')}`}
    >
      {children}
    </div>
  );
}
