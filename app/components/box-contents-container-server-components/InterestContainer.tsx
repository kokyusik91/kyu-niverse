import React from 'react';
import { KKS } from '@/app/constants/interest';
import Interest from '../box-contents/Interest';

export default function InterestContainer() {
  return (
    <Interest>
      <h1>
        <span className='text-[32px] font-extrabold'>고규식은</span>
        <br />
        <div className='flex items-center'>
          <div className='h-[48px] m-auto overflow-hidden'>
            <ul className='textbox'>
              {KKS.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center justify-end text-[32px] font-extrabold bg-gradient-to-t from-red-300  to-indigo-700 text-transparent bg-clip-text'
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <span className='text-[32px] font-extrabold'>을 좋아합니다.</span>
        </div>
      </h1>
    </Interest>
  );
}
