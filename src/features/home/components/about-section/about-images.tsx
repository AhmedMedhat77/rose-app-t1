import Image from "next/image";

export default function AboutImages() {
  return (
    <div className="relative h-97.5 w-140 max-w-full shrink-0">
      <div
        aria-hidden="true"
        className="border-maroon-600 absolute inset-s-0 top-1.25 bottom-1 left-1 h-90.75 w-67.25 rotate-[-3.09deg] rounded-tl-[3.1rem] rounded-tr-[7.5rem] rounded-br-[7.5rem] rounded-bl-[7.5rem] border-4 rtl:rotate-[3.09deg]"
      />
      <div className="absolute inset-s-10.5 top-6 left-[1.7rem] h-86 w-75.5 overflow-hidden rounded-tl-[3.1rem] rounded-tr-[7.5rem] rounded-br-[7.5rem] rounded-bl-[7.5rem]">
        <Image
          src="/images/violet-figt.png"
          alt=""
          fill
          sizes="16.87rem"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-e-0 top-5 size-48.25 overflow-hidden rounded-full">
        <Image
          src="/images/orange-gift.png"
          alt=""
          fill
          sizes="12rem"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-e-0 bottom-6 h-36 w-48.25 overflow-hidden rounded-tl-[3.1rem] rounded-tr-[6.25rem] rounded-br-[6.25rem] rounded-bl-[3.1rem]">
        <Image
          src="/images/ballon-gift.png"
          alt=""
          fill
          sizes="12rem"
          className="object-cover"
        />
      </div>
    </div>
  );
}
