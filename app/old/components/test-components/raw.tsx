export default function Raw() {
  return (
    <div className="w-full p-5 bg-white">
      <div className="w-full h-[1000px] flex bg-white gap-5">
        <div className="w-2/6 h-full flex flex-col bg-white gap-5">
          <div className="w-full flex grow gap-5">
            <div className="w-1/2 h-full flex flex-col bg-white gap-5">
              <div className="target h-1/4 bg-slate-400"></div>
              <div className="target grow bg-slate-800"></div>
              <div className="target h-1/4	 bg-slate-400"></div>
            </div>
            <div className="target w-1/2 h-full bg-purple-400"></div>
          </div>
          <div className="target h-2/6 bg-blue-400"></div>
        </div>
        <div className="flex flex-col grow bg-white gap-5">
          <div className="target flex grow bg-white gap-5">
            <div className="target grow bg-rose-400"></div>
            <div className="target w-1/2 bg-emerald-300"></div>
            <div className="flex flex-col grow bg-white gap-5">
              <div className="target grow bg-sky-400"></div>
              <div className="target h-2/6 bg-teal-400"></div>
            </div>
          </div>
          <div className="flex h-2/5 bg-white gap-5">
            <div className="target w-3/6 h-full bg-yellow-400"></div>
            <div className="target grow h-full bg-violet-400"></div>
            <div className="target grow h-full bg-zinc-400"></div>
          </div>
          <div className="flex grow bg-white gap-5">
            <div className="target grow bg-fuchsia-400"></div>
            <div className="target w-1/2 bg-lime-400"></div>
            <div className="target grow bg-sky-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
