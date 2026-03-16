import Image from 'next/image';
import GithubBlog from '../box-contents/GithubBlog';

export default function GithubBlogContainer() {
  return (
    <GithubBlog>
      <Image
        className='animate-bounce'
        src={'/avatar2.png'}
        width={150}
        height={150}
        objectFit=''
        alt='me'
      />
    </GithubBlog>
  );
}
