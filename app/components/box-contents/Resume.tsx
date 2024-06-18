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
      className='target relative h-1/4 transition-all bg-gradient-to-t  from-blue-400  to-green-200 p-3'
    >
      {children}
    </a>
  );
}
