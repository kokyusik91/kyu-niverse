import { Suspense } from 'react';
import BookContainer from '../BookContainer';
import BookStore from '../box-contents/BookStore';

export default function BookStoreContainer() {
  return (
    <BookStore>
      <div className='flex items-center justify-center h-full w-full m-0'>
        <Suspense fallback='책 가져오는중'>
          <BookContainer />
        </Suspense>
      </div>
      <span className='absolute right-5 bottom-2 text-gray-100 font-medium'>
        👈🏻 책을 눌러보세요!
      </span>
    </BookStore>
  );
}
