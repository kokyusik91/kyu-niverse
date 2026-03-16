import Link from "next/link";
import Empty from "../box-contents/Empty";

export default function EmptyContainer() {
  return (
    <Empty>
      <ul className="flex h-full w-full flex-col gap-3">
        {/* 단점을 굳이 노출시켜 줘야할까?! */}
        {/* <Link
          href={
            "https://jamsilcrops-library.notion.site/38c1b34aa7eb4bd1b47105764bcdb8f3?pvs=4"
          }
          className="target flex w-full flex-grow items-center justify-center rounded-lg bg-white p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 😵
        </Link> */}
        <Link
          href={
            "https://jamsilcrops-library.notion.site/662289648d454f488a0ac36b0062e44f?pvs=4"
          }
          target="_blank"
          className="target flex w-full flex-grow items-center justify-center rounded-lg bg-white p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 🙏🏻
        </Link>

        <Link
          href={
            "https://jamsilcrops-library.notion.site/56df6918969745b6b3ceffb5e24412c0?pvs=4"
          }
          target="_blank"
          className="target flex w-full flex-grow items-center justify-center rounded-lg bg-white p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 👍🏻
        </Link>

        <Link
          href={
            "https://jamsilcrops-library.notion.site/676e8545f34947b684a005680a9a662a?pvs=4"
          }
          target="_blank"
          className="target flex w-full flex-grow items-center justify-center rounded-lg bg-white p-3 text-2xl font-bold text-zinc-800"
        >
          Wat I 😽
        </Link>
      </ul>
    </Empty>
  );
}
