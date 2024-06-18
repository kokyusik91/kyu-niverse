export default function Phone() {
  return (
    <div className='relative w-full h-full p-1 pt-3 bg-gray-700'>
      <header className='relative flex justify-between items-center h-6 mb-8 xl:px-2 3xl:px-5'>
        <time className='font-medium'>11:33</time>
        <div className='absolute bg-black w-20 h-full top-0 left-1/2 transform -translate-x-1/2 rounded-l-2xl rounded-r-2xl'></div>
        <div className='flex gap-2'>
          <span className='text-bold sm:opacity-0'>LTE</span>
          <div className='flex items-center'>
            <div className='relative w-7 h-4 bg-slate-300 rounded-l-md rounded-r-md'>
              <div className='w-4/6 h-full bg-green-300 rounded-l-md'></div>
              <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs'>
                75
              </span>
            </div>
            <div className='w-[1.5px] h-1 bg-slate-300 rounded-r-lg'></div>
          </div>
        </div>
      </header>
      <div className='h-[500px] overflow-auto'></div>
      <footer className='absolute w-full h-14 bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/4 px-3'>
        <nav className='w-full h-full rounded-l-xl rounded-r-xl bg-slate-400'></nav>
      </footer>
    </div>
  );
}
