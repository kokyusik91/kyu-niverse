import { Suspense } from "react";
import BookContainer from "../BookContainer";
import BookStore from "../box-contents/BookStore";

const FakeBook = () => {
  return <div className="h-[300px] w-[200px]"></div>;
};

export default function BookStoreContainer() {
  return (
    <BookStore>
      <div className="m-0 flex h-full w-full items-center justify-center">
        <Suspense fallback={<FakeBook />}>
          <BookContainer />
        </Suspense>
      </div>
      <span className="absolute bottom-2 right-5 hidden font-medium text-zinc-700 2xl:block">
        👈🏻 책을 눌러보세요!
      </span>
    </BookStore>
  );
}
