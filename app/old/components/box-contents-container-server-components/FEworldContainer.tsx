import Image from "next/image";
import FEworld from "../box-contents/FEworld";

export default function FEworldContainer() {
  return (
    <FEworld>
      <Image
        className="absolute left-1/2 top-1/2"
        src={"/nasa.jpg"}
        fill
        alt="nasa"
      />
      <h1 className="z-10 text-right text-5xl font-extrabold lg:text-[50px] xl:text-[70px] 2xl:text-[90px]">
        KYU&apos;S
        <br /> FE World
      </h1>
    </FEworld>
  );
}
