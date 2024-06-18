import Resume from "../box-contents/Resume";

export default function ResumeContainer() {
  return (
    <Resume>
      <span className="relative z-10 mr-2 font-bold lg:text-2xl xl:text-3xl 2xl:text-4xl">
        RESUME
      </span>
      <span className="animate-[3s_roundup_ease-in-out_infinite_alternate-reverse] lg:text-2xl xl:text-3xl 2xl:text-4xl">
        💾
      </span>
    </Resume>
  );
}
