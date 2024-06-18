import Image from 'next/image';
import BEworld from '../box-contents/BEworld';

export default function BEworldContainer() {
  return (
    <BEworld>
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
    </BEworld>
  );
}
