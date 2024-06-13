import { useState } from 'react';
import Image from 'next/image';

type SkillTem = {
  value: string;
  label: string;
  color: string;
  url: string;
};

const SKILL = [
  {
    value: 'react',
    label: 'REACT',
    color: 'text-blue-400',
    url: '/react2.svg',
  },
  {
    value: 'next',
    label: 'NEXT.JS',
    color: 'text-gray-500',
    url: '/nextjs.svg',
  },
  {
    value: 'tanstack',
    label: 'Tanstack',
    color: 'text-red-500',
    url: '/tanstack.webp',
  },
  {
    value: 'express',
    label: 'EXPRESS.JS',
    color: 'text-green-500',
    url: '/Expressjs.png',
  },
  {
    value: 'vue',
    label: 'VUE.JS',
    color: 'text-green-400',
    url: '/vue.png',
  },
  {
    value: 'svelte',
    label: 'SVELETE',
    color: 'text-orange-400',
    url: '/svelte.png',
  },
  {
    value: 'nest',
    label: 'NEST.JS',
    color: 'text-red-400',
    url: '/nest.svg',
  },
  {
    value: 'webpack',
    label: 'WEBPACK',
    color: 'text-zinc-200',
    url: '/webpack.svg',
  },
  {
    value: 'vite',
    label: 'VITE',
    color: 'text-purple-400',
    url: '/vite.svg',
  },
];

export default function Skillset() {
  const [target, setTarget] = useState<SkillTem | null>(null);
  const [isToggleOn, setToggleOn] = useState(false);

  const handleOver = (item: SkillTem) => {
    setToggleOn(true);
    setTarget(item);
  };

  const handleFirstBlur2 = () => {
    setToggleOn(false);
    setTarget(null);
  };

  return (
    <div className=''>
      <h1 className='text-2xl font-extrabold text-center mb-3'>I LOVE 😘</h1>
      <p
        className={`h-10 mb-7 ${
          target?.color
        } text-4xl font-extrabold text-center transition-all ease-in-out duration-300 ${
          isToggleOn
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-full'
        }`}
      >
        {target?.label || ''}
      </p>
      <div className='flex overflow-hidden'>
        <ul className='flex animate-[120s_rollingleft1_linear_infinite]'>
          {[...SKILL, ...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onMouseOver={() => handleOver(item)}
              onMouseOut={handleFirstBlur2}
              className='w-[50px] h-[50px] shrink-0 mx-2'
            >
              <Image
                width={50}
                height={50}
                src={item.url}
                alt={item.label}
                className='w-[50px] h-[50px]'
              />
            </li>
          ))}
        </ul>
        <ul className='flex animate-[120s_rollingleft2_linear_infinite]'>
          {[...SKILL, ...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onMouseOver={() => handleOver(item)}
              onMouseOut={handleFirstBlur2}
              className='w-[50px] h-[50px] shrink-0 mx-2'
            >
              <Image
                width={50}
                height={50}
                src={item.url}
                alt={item.label}
                className='w-[50px] h-[50px]'
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
