import { createContents } from '@/app/utils/action';
import SubmitButton from '../SubmitButton';
import Empty from '../box-contents/Empty';

export default function EmptyContainer() {
  return (
    <Empty>
      {/* <form action={createContents} className='mx-auto'>
        <input name='contents' className='text-zinc-800 mr-10 p-3' />
        <SubmitButton />
      </form> */}
    </Empty>
  );
}
