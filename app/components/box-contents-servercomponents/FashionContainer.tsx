import Image from 'next/image';
import ImageSlider from '../ImageSlider';
import Fashion from '../box-contents/Fashion';
import HeadSlider from '../headSlider';
import PantsSlider from '../pantsSlider';
import { CLOTHES, MANHEAD, PANTS } from '@/app/constants/fashion';

export default function FashionContainer() {
  return (
    <Fashion>
      <div className='flex w-full h-full flex-col items-center p-3'>
        <HeadSlider data={MANHEAD} />
        {/* <Image src={'/hks.png'} alt='멀왕' width={60} height={60} /> */}
        <ImageSlider data={CLOTHES} width={200} height={200} />
        <PantsSlider data={PANTS} width={150} height={150} />
        <div className='relative flex gap-7 top-14 justify-center'>
          <Image src='/j-l.png' alt='자운드 왼쪽' width={100} height={100} />
          <Image src='/j-r.png' alt='자운드 오른쪽' width={100} height={100} />
        </div>
      </div>
    </Fashion>
  );
}
