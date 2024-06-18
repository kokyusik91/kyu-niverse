import { Suspense } from 'react';
import BookContainer from '../BookContainer';
import BookStore from '../box-contents/BookStore';


const FakeBook = ()=>{
  return <div className='w-[200px] h-[300px] '></div>
}

export default function BookStoreContainer() {
  return (
    <BookStore>
      <div className='flex items-center justify-center h-full w-full m-0'>
        <Suspense fallback={<FakeBook/>}>
          <BookContainer />
        </Suspense>
      </div>
      <span className='absolute right-5 bottom-2 text-gray-100 font-medium'>
        👈🏻 책을 눌러보세요!
      </span>
    </BookStore>
  );
}
