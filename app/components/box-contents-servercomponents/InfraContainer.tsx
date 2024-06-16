import Infra from '../box-contents/Infra';

export default function InfraContainer() {
  return (
    <Infra>
      <div className='flex gap-12'>
        <h1 className='text-5xl font-bold animate-[1s_wiggle_infinite]'>📡</h1>
        <div>
          <div className='text-yellow-300 text-xl animate-[1s_connect_ease-in-out_infinite_alternate-reverse]'>
            ➡️ ➡️ ➡️
          </div>
          <div className='text-yellow-300 text-xl animate-[1s_connectreverse_ease-in-out_infinite_alternate-reverse]'>
            ⬅️ ⬅️ ⬅️
          </div>
        </div>
        <h1 className='text-5xl font-bold'>💻</h1>
      </div>
    </Infra>
  );
}
