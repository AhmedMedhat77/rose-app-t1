import Image from "next/image";
import imageOne from "@/assets/1.png";
import imageTwo from "@/assets/2.png";
import imageThree from "@/assets/3.png";
import imageFour from "@/assets/4.png";
import imageFive from "@/assets/5.png";
import imageSix from "@/assets/6.png";

export default function PhotoGallery() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-4 py-10">
      <div className="grid grid-cols-1 gap-2 overflow-hidden sm:grid-cols-3">
        {/* First Column */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[390px] overflow-hidden rounded-lg">
            <Image
              src={imageOne}
              alt="Beautiful Rose"
              fill
              sizes=" 100vw, 33vw"
              className="object-fit h-[38.5625rem] w-[26.125rem] transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="relative h-[250px] overflow-hidden rounded-lg">
            <Image
              src={imageTwo}
              alt="Beautiful Rose2"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-fit transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[270px] overflow-hidden rounded-lg">
            <Image
              src={imageThree}
              alt="Beautiful Rose3"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-fit transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="relative h-[370px] overflow-hidden rounded-lg">
            <Image
              src={imageFour}
              alt="Beautiful Rose4"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-fit transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Third Column */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[270px] overflow-hidden rounded-lg">
            <Image
              src={imageFive}
              alt="Beautiful Rose5"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-fit transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="relative h-[370px] overflow-hidden rounded-lg">
            <Image
              src={imageSix}
              alt="Beautiful Rose6"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-fit transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
