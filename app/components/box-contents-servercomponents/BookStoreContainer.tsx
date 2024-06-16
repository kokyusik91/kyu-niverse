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
    </BookStore>
  );
}
