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
                  className='textboxchild text-[32px] font-extrabold'
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
