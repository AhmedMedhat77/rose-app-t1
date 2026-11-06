import Image from "next/image";

export default function AboutImages() {
  return (
    <div className="relative h-97.5 w-140 max-w-full shrink-0">
      {/* الإطار الأحمر */}

      <div
        aria-hidden="true"
        className="border-maroon-600 absolute inset-s-0 top-1.25 bottom-1 left-1 h-90.75 w-67.25 rotate-[-3.09deg] rounded-tl-[50px] rounded-tr-[120px] rounded-br-[120px] rounded-bl-[120px] border-4 rtl:rotate-[3.09deg]"
      />

      {/* الصورة الكبيرة */}
      <div className="absolute inset-s-10.5 top-[24.1px] left-[27.49px] h-86 w-75.5 overflow-hidden rounded-tl-[50px] rounded-tr-[120px] rounded-br-[120px] rounded-bl-[120px]">
        <Image
          src="/images/violet-figt.png"
          alt=""
          fill
          sizes="270px"
          className="object-cover"
        />
      </div>

      {/* الدايرة */}
      <div className="absolute inset-e-0 top-5 size-48.25 overflow-hidden rounded-full">
        <Image
          src="/images/orange-gift.png"
          alt=""
          fill
          sizes="193px"
          className="object-cover"
        />
      </div>

      {/* الصورة التحتانية */}
      <div className="absolute inset-e-0 bottom-6 h-36 w-48.25 overflow-hidden rounded-tl-[50px] rounded-tr-[100px] rounded-br-[100px] rounded-bl-[50px]">
        <Image
          src="/images/ballon-gift.png"
          alt=""
          fill
          sizes="193px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
