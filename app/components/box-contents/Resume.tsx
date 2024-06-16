'use client';

import { ReactNode } from 'react';

type ResumeProps = {
  children: ReactNode;
};

export default function Resume({ children }: ResumeProps) {
  return (
    <a
      href='/resume-kokyusik.pdf'
      target='_blank'
      rel='noopener noreferrer'
      download
      className='target relative h-1/4 transition-all'
    >
      {children}
    </a>
  );
}
