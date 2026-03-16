import Infra from "../box-contents/Infra";

export default function InfraContainer() {
  return (
    <Infra>
      <div className="flex items-center gap-12">
        <h1 className="animate-[1s_wiggle_infinite] text-5xl font-bold">📡</h1>
        <div>
          <div className="lg:text-md animate-[1s_connect_ease-in-out_infinite_alternate-reverse] text-xl text-zinc-700">
            ➡️ ➡️
          </div>
          <div className="lg:text-md animate-[1s_connectreverse_ease-in-out_infinite_alternate-reverse] text-xl text-zinc-700">
            ⬅️ ⬅️
          </div>
        </div>
        <h1 className="text-5xl font-bold">💻</h1>
      </div>
    </Infra>
  );
}
