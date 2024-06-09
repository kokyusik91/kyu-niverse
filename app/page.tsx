'use client';
import Image from 'next/image';
import { useState } from 'react';
import { CardSlider } from './components/slider';
import SkillSet from './components/skillset';
import Phone from './components/phone';
import Skillset from './components/skillset';
import Health from './components/health';
import { SmallCardSlider } from './components/slidersmall';
import HeadSlider from './components/headSlider';
import ImageSlider from './components/ImageSlider';
import PantsSlider from './components/pantsSlider';

const PANTS = [
  '/zard.png',
  '/kitty.png',
  '/athlete.png',
  '/jeans.png',
  '/watthe.png',
];

const CLOTHES = [
  '/crown.png',
  '/zombie.png',
  '/stussy2.png',
  '/stuussy.png',
  '/supreme.png',
  '/supreme2.png',
  '/dice.png',
  '/8ball.png',
];

const MANHEAD = [
  '👦🏼',
  '👶🏻',
  '🧒🏻',
  '👩🏼',
  '👨🏼',
  '🧔🏻‍♂️',
  '👩🏼‍🦱',
  '👩🏽‍🦰',
  '👨🏼‍🦰',
  '👱🏼‍♀️',
  '🧓🏼',
];

const KKS = [
  '스투시',
  '양진성',
  '나종완',
  'JPOP',
  '김기태',
  '호이',
  '두이',
  '세이',
  'dkdkdk',
  '뭐',
  '스투시',
];

export default function Home() {
  const [mono, setMono] = useState(false);
  const [kofetch, setKofetch] = useState(false);
  const [brunch, setBrunch] = useState(false);

  const toggleColor = () => {
    setMono((prev) => !prev);
  };

  const toggleMonoColor = (color: string) => {
    if (mono) return 'bg-slate-200';

    return color;
  };

  const handleKofetch = () => {
    setKofetch(true);
  };

  const handleKofetch2 = () => {
    setKofetch(false);
  };

  const handleBrunch = () => {
    setBrunch(true);
  };
  const handleBrunch2 = () => {
    setBrunch(false);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-yellow-200'>
      <div className='w-full flex text-left'>
        {/* <Image
          className='z-10 relative animate-[wiggle_.01s_ease-in-out_infinite]'
          src={'/scv.webp'}
          width={119}
          height={160}
          alt='starcraft scv'
        />
        <Image
          className='z-10 relative animate-[movescv2_1s_ease-in-out_infinite_alternate]'
          src={'/scv.webp'}
          width={119}
          height={160}
          alt='starcraft scv'
        />
        <Image
          className='z-10 relative animate-[movescv2_.5s_ease-in-out_infinite_alternate]'
          src={'/scv.webp'}
          width={119}
          height={160}
          alt='starcraft scv'
        />
        <Image
          className='z-10 relative animate-[movescv3_10s_ease-in-out_infinite_alternate]'
          src={'/scv.webp'}
          width={119}
          height={160}
          alt='starcraft scv'
        /> */}
      </div>

      <div className='w-full text-right'>
        <button
          onClick={toggleColor}
          className={`mb-3 p-5 text-xl rounded-lg font-bold transition-all ease-in-out ${
            mono ? 'bg-red-500 text-zinc-200' : 'bg-white text-zinc-800'
          }`}
        >
          {mono ? '컬러로' : '모노로'}
        </button>
      </div>
      <div className='w-full p-5 bg-white rounded-md'>
        <div className='w-full h-[1000px] flex bg-white gap-5'>
          <div className='w-2/6 h-full flex flex-col bg-white gap-5'>
            <div className='w-full flex grow gap-5'>
              <div className='w-1/2 h-full flex flex-col bg-white gap-5'>
                <a
                  href='/polio.pdf'
                  target='_blank'
                  rel='noopener noreferrer'
                  download
                  className='target relative h-1/4 transition-all'
                >
                  {/* ResumeBox */}
                  <Image
                    className='absolute top-1/2 left-1/2'
                    src={'/resume.jpg'}
                    fill
                    alt='gradient'
                  />
                  <span className='mr-2 text-5xl font-bold z-10 relative'>
                    RESUME
                  </span>
                  <span className='text-3xl animate-[3s_roundup_ease-in-out_infinite_alternate-reverse]'>
                    💾
                  </span>
                </a>
                <div
                  className={`target relative grow transition-all ${toggleMonoColor(
                    'bg-slate-800'
                  )} `}
                >
                  <Skillset />
                </div>
                <div
                  className={`target h-1/4 transition-all ${toggleMonoColor(
                    'bg-slate-400'
                  )}`}
                >
                  <Image
                    className='animate-bounce'
                    src={'/avatar2.png'}
                    width={150}
                    height={150}
                    objectFit=''
                    alt='me'
                  />
                </div>
              </div>
              <div
                className={`target w-1/2 h-full transition-all ${toggleMonoColor(
                  'bg-purple-400 '
                )}`}
              >
                <div className='flex w-full h-full flex-col items-center p-3'>
                  <HeadSlider data={MANHEAD} />
                  {/* <Image src={'/hks.png'} alt='멀왕' width={60} height={60} /> */}
                  <ImageSlider data={CLOTHES} width={200} height={200} />
                  <PantsSlider data={PANTS} width={150} height={150} />
                  <div className='relative flex gap-7 top-14 justify-center'>
                    <Image
                      src='/j-l.png'
                      alt='자운드 왼쪽'
                      width={100}
                      height={100}
                    />
                    <Image
                      src='/j-r.png'
                      alt='자운드 오른쪽'
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`target h-2/6 transition-all ${toggleMonoColor(
                'bg-blue-400'
              )}`}
            >
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
                  <span className='text-[32px] font-extrabold'>
                    을 좋아합니다.
                  </span>
                </div>
              </h1>
            </div>
          </div>
          <div className='flex flex-col grow bg-white gap-5'>
            <div className='flex grow bg-white gap-5'>
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  'bg-rose-400'
                )}`}
              >
                <Image
                  className='z-10 relative animate-[wiggle_.5s_ease-in-out_infinite]'
                  src={'/medic2.png'}
                  width={119}
                  height={160}
                  alt='starcraft scv'
                />
                <h1
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3  text-[120px] ${
                    mono ? 'text-zinc-700' : 'text-zinc-200'
                  } font-bold`}
                >
                  Medic
                </h1>
              </div>
              <div
                className={`target w-1/2 transition-all ${toggleMonoColor(
                  'bg-gradient-to-r  from-indigo-400 to-red-300'
                )}`}
              >
                <div className='flex items-center justify-center h-full w-full m-0'>
                  <SmallCardSlider />
                </div>
              </div>
              <div className='flex flex-col grow bg-white gap-5'>
                <div
                  onMouseEnter={handleBrunch}
                  onMouseLeave={handleBrunch2}
                  className={`relative target flex flex-col grow transition-all ${toggleMonoColor(
                    'bg-sky-400'
                  )}`}
                >
                  <Image
                    className={`mb-3 transition-all duration-1000 z-50 ${
                      brunch ? 'translate-x-0' : 'translate-x-[-1000px]'
                    } ${brunch ? 'rotate-0' : 'rotate-180'} ${
                      brunch ? 'opacity-1' : 'opacity-0'
                    }`}
                    src={'/brunch.svg'}
                    width={119}
                    height={160}
                    alt='brunch logo'
                  />
                  <h1
                    className={`transition-all duration-1000 text-lg font-bold ${
                      brunch ? 'translate-x-0' : 'translate-x-[200px]'
                    } ${brunch ? 'rotate-0' : 'rotate-180'}`}
                  >
                    Brunch
                  </h1>
                  <h1
                    className={`${
                      brunch ? 'opacity-0' : 'opacity-1'
                    } transition-all text-5xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 `}
                  >
                    ✍️
                  </h1>
                </div>
                <div
                  onMouseEnter={handleKofetch}
                  onMouseLeave={handleKofetch2}
                  className={`target h-2/6 transition-all 	 ${toggleMonoColor(
                    'bg-teal-400'
                  )}`}
                >
                  <div className='flex items-end'>
                    <h1 className='text-3xl font-extrabold'>Ko</h1>
                    <span
                      className={`${
                        kofetch ? 'translate-x-0' : 'translate-x-[300px] '
                      } transition-all text-xl font-semibold  duration-1000 ease-in-out`}
                    >
                      Fetch
                    </span>
                  </div>
                  <Image
                    className='ml-2'
                    src='/npm.webp'
                    width={120}
                    height={60}
                    alt='앤피엠'
                  />
                </div>
              </div>
            </div>
            <div className='flex h-2/5 bg-white gap-5'>
              <div
                className={`target relative w-3/6 h-full transition-all ${toggleMonoColor(
                  'bg-yellow-400'
                )}`}
              >
                <Image
                  className='absolute top-1/2 left-1/2'
                  src={'/nasa.jpg'}
                  fill
                  alt='nasa'
                />
                <h1 className='text-[100px] font-extrabold z-10 text-right'>
                  KYU&apos;S
                  <br /> FE World
                </h1>
              </div>
              <div
                className={`target grow h-full transition-all ${toggleMonoColor(
                  'bg-violet-400'
                )}`}
              >
                <Image
                  className='absolute top-1/2 left-1/2'
                  src={'/new-york.jpg'}
                  fill
                  alt='new-york'
                />
                <h1 className='text-2xl font-extrabold z-10 text-right hover:text-4xl transition-all duration-1000'>
                  KYU&apos;S
                  <br /> BE World
                </h1>
              </div>
              <div
                className={`target grow h-full transition-all ${toggleMonoColor(
                  'bg-zinc-400'
                )}`}
              ></div>
            </div>
            <div className='flex grow bg-white gap-5'>
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  'bg-fuchsia-400'
                )}`}
              >
                <Image
                  className='z-10 animate-spin'
                  src={'/github.png'}
                  width={119}
                  height={160}
                  alt='brunch logo'
                />
              </div>
              <div
                className={`target w-1/2 transition-all ${toggleMonoColor(
                  'bg-gradient-to-r  from-green-200 to-indigo-300'
                )}`}
              >
                <Health />
              </div>
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  'bg-sky-400'
                )}`}
              >
                <div className='flex gap-12'>
                  <h1 className='text-5xl font-bold animate-[1s_wiggle_infinite]'>
                    📡
                  </h1>
                  <div>
                    <div className='text-yellow-300 text-xl animate-[1s_connect_ease-in-out_infinite_alternate-reverse]'>
                      ➡️ ➡️ ➡️
                    </div>
                    <div className='text-yellow-300 text-xl animate-[1s_connectreverse_ease-in-out_infinite_alternate-reverse]'>
                      ⬅️ ⬅️ ⬅️
                    </div>
                  </div>
                  <h1 className='text-5xl font-bold'>💻</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
