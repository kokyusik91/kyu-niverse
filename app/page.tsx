'use client';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';

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
  '스투시2',
];

export default function Home() {
  const [mono, setMono] = useState(true);

  const [first, setFirst] = useState(false);

  const handleFirstBlur = (e: SyntheticEvent) => {
    setFirst(true);
  };

  const handleFirstBlur2 = (e: SyntheticEvent) => {
    setFirst(false);
  };

  const toggleColor = () => {
    setMono((prev) => !prev);
  };

  const toggleMonoColor = (color: string) => {
    if (mono) return 'bg-slate-200';

    return color;
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-red-300'>
      <div className='w-full flex text-left'>
        <Image
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
        />
      </div>

      <div className='w-full text-right'>
        <button
          onClick={toggleColor}
          className={`mb-3 p-5 text-xl rounded-lg font-bold transition-all ${
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
                <div
                  onMouseOver={handleFirstBlur}
                  onMouseOut={handleFirstBlur2}
                  className={`target relative h-1/4 transition-all`}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center ${toggleMonoColor(
                      'bg-yellow-400'
                    )} ${first ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <h1 className='text-4xl font-extrabold'>고규시키.</h1>
                  </div>
                  {
                    <div
                      className={`w-full h-full absolute flex items-center justify-center  text-zinc-700 transition-all ${
                        first ? 'bg-blur-10' : 'opacity-0'
                      }`}
                    >
                      <h1 className='text-3xl text-blue-500 font-extrabold'>
                        짱입니다!
                      </h1>
                    </div>
                  }
                </div>
                <div
                  className={`target relative grow transition-all ${toggleMonoColor(
                    'bg-slate-800'
                  )} `}
                >
                  <Image
                    className='absolute top-1/2 left-1/2'
                    src={'/resume.jpg'}
                    fill
                    alt='gradient'
                  />
                  <h1 className='text-5xl font-bold animate-pulse z-10'>
                    RESUME
                  </h1>
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
                  'bg-purple-400'
                )}`}
              ></div>
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
                      {KKS.map((item) => (
                        <li
                          key={item}
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
                  className='z-10 relative animate-[wiggle_.01s_ease-in-out_infinite]'
                  src={'/scv.webp'}
                  width={119}
                  height={160}
                  alt='starcraft scv'
                />
                <h1
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3  text-[220px] ${
                    mono ? 'text-zinc-700' : 'text-zinc-200'
                  } font-bold`}
                >
                  scv
                </h1>
              </div>
              <div
                className={`target w-1/2 transition-all ${toggleMonoColor(
                  'bg-emerald-300'
                )}`}
              ></div>
              <div className='flex flex-col grow bg-white gap-5'>
                <div
                  className={`target flex flex-col grow transition-all ${toggleMonoColor(
                    'bg-sky-400'
                  )}`}
                >
                  <Image
                    className='mb-3'
                    src={'/brunch.svg'}
                    width={119}
                    height={160}
                    alt='brunch logo'
                  />
                  <h1 className='text-lg font-medium'>Brunch</h1>
                </div>
                <div
                  className={`target h-2/6 transition-all ${toggleMonoColor(
                    'bg-teal-400'
                  )}`}
                >
                  KoFetch
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
                  KYU'S
                  <br /> FE World
                </h1>
              </div>
              <div
                className={`target grow h-full transition-all ${toggleMonoColor(
                  'bg-violet-400'
                )}`}
              >
                {' '}
                Kyu's BE World
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
                  'bg-lime-400'
                )}`}
              ></div>
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  'bg-sky-400'
                )}`}
              >
                Infra
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
