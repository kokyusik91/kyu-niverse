'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SKILL } from '../constants/skillset';

type SkillTem = {
  value: string;
  label: string;
  color: string;
  url: string;
};

export default function Skillset() {
  const [target, setTarget] = useState<SkillTem | null>(null);
  const [isToggled, setToggled] = useState(false);

  const handleMouseOver = (item: SkillTem) => {
    setToggled(true);
    setTarget(item);
  };

  const handleMouseOut = () => {
    setToggled(false);
    setTarget(null);
  };

  return (
    <div className=''>
      <h1 className='text-2xl font-extrabold text-center mb-3'>I LOVE 😘</h1>
      <p
        className={`h-10 mb-7 ${
          target?.color
        } text-4xl font-extrabold text-center transition-all ease-in-out duration-300 ${
          isToggled
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-full'
        }`}
      >
        {target?.label}
      </p>
      <div className='flex overflow-hidden'>
        <ul className='flex animate-[120s_rollingleft1_linear_infinite]'>
          {[...SKILL, ...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
            >
              <Image
                width={50}
                height={50}
                src={item.url}
                alt={item.label}
              />
            </li>
          ))}
        </ul>
        <ul className='flex animate-[120s_rollingleft2_linear_infinite]'>
          {[...SKILL, ...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
            >
              <Image
                width={50}
                height={50}
                src={item.url}
                alt={item.label}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
