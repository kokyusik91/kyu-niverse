import React, { SyntheticEvent, useState } from 'react';

function hover() {
  const [first, setFirst] = useState(false);

  const handleFirstBlur = (e: SyntheticEvent) => {
    setFirst(true);
  };

  const handleFirstBlur2 = (e: SyntheticEvent) => {
    setFirst(false);
  };
  return (
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
          <h1 className='text-3xl text-blue-500 font-extrabold'>짱입니다!</h1>
        </div>
      }
    </div>
  );
}

export default hover;
