import Image from 'next/image';
import FEworld from '../box-contents/FEworld';

export default function FEworldContainer() {
  return (
    <FEworld>
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
    </FEworld>
  );
}
