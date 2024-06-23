import Link from "next/link";
import Empty from "../box-contents/Empty";

export default function EmptyContainer() {
  return (
    <Empty>
      <ul className="flex h-full w-full flex-col gap-3">
        <Link
          href={""}
          className="target flex w-full flex-grow items-center justify-center rounded-lg p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 😵
        </Link>
        <Link
          href={""}
          className="target flex w-full flex-grow items-center justify-center rounded-lg p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 🙏🏻
        </Link>

        <Link
          href={""}
          className="target flex w-full flex-grow items-center justify-center rounded-lg p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 👍🏻
        </Link>

        <Link
          href={""}
          className="target flex w-full flex-grow items-center justify-center rounded-lg p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 😽
        </Link>
      </ul>
    </Empty>
  );
}
