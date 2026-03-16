import Link from "next/link";
import Image from "next/image";

type LinkButtonProps = {
  url: string;
  src: string;
};

export default function LinkButton({ url, src }: LinkButtonProps) {
  return (
    <Link href={url} target="_blank" className="rounded-full bg-slate-100 p-2">
      <Image src={src} width={30} height={30} alt="깃헙 이미지" />
    </Link>
  );
}
