import Image from "next/image";
import BEworld from "../box-contents/BEworld";

export default function BEworldContainer() {
  return (
    <BEworld>
      <Image
        className="absolute left-1/2 top-1/2"
        src={"/new-york.jpg"}
        fill
        alt="new-york"
      />
      <h1 className="z-10 text-right text-5xl font-extrabold transition-all duration-1000 hover:text-4xl lg:text-2xl">
        KYU&apos;S
        <br /> BE World
      </h1>
    </BEworld>
  );
}
