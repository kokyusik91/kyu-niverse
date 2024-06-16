import Image from 'next/image';
import Resume from '../box-contents/Resume';

export default function ResumeContainer() {
  return (
    <Resume>
      <Image
        className='absolute top-1/2 left-1/2'
        src={'/resume.jpg'}
        fill
        alt='gradient'
      />
      <span className='mr-2 text-5xl font-bold z-10 relative'></span>
      <span className='text-3xl animate-[3s_roundup_ease-in-out_infinite_alternate-reverse]'>
        💾
      </span>
    </Resume>
  );
}
