import Image from 'next/image';
import Github from '../box-contents/Github';

export default function GithubContainer() {
  return (
    <Github>
      <Image
        className='z-10 animate-spin'
        src={'/github.png'}
        width={119}
        height={160}
        alt='brunch logo'
      />
    </Github>
  );
}
