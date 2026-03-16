import Image from 'next/image';
import Medic from '../box-contents/Medic';

export default function MedicContainer() {
  return (
    <Medic>
      <Image
        className='z-10 relative animate-[wiggle_.5s_ease-in-out_infinite]'
        src={'/medic2.png'}
        width={119}
        height={160}
        alt='starcraft scv'
      />
      <h1
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3  text-[120px] font-bold`}
      >
        Medic
      </h1>
    </Medic>
  );
}
