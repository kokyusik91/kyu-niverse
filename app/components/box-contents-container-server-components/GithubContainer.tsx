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
      <div className="absolute top-0 right-[-20px] mr-auto flex max-w-[80%] flex-col gap-2 rounded-r-xl rounded-tl-xl bg-slate-100 p-4 md:max-w-[60%] dark:bg-slate-800">
        <div className="text-sm text-slate-700 dark:text-slate-300">
            어지러...
        </div>
      </div>
    </Github>
  );
}
