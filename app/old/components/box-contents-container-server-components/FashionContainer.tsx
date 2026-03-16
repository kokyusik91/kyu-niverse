import Image from "next/image";
import ImageSlider from "../slider/ImageSlider";
import Fashion from "../box-contents/Fashion";
import HeadSlider from "../slider/headSlider";
import PantsSlider from "../slider/pantsSlider";
import { CLOTHES, PEOPLE_HEAD, PANTS } from "@/app/constants/fashion";

export default function FashionContainer() {
  return (
    <Fashion>
      <div className="h-full w-full flex-col py-10">
        <HeadSlider data={PEOPLE_HEAD} />
        <ImageSlider data={CLOTHES} />
        <PantsSlider data={PANTS} />
      </div>
    </Fashion>
  );
}
