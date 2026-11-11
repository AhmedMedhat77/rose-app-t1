import Image from "next/image";
import imageOne from "@/assets/7.png";
import imageTwo from "@/assets/8.png";
import imageThree from "@/assets/9.png";
import imageFour from "@/assets/10.png";
import imageFive from "@/assets/11.png";
import imageSix from "@/assets/12.png";

export default function CompaniesImages() {
  return (
    <div className="flex justify-around py-10 align-middle">
      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageOne} alt="coconut." className="w-[100%]" />
      </div>

      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageTwo} alt="ginyard" className="w-[100%]" />
      </div>

      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageThree} alt="ingoude" className="w-[100%]" />
      </div>

      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageFour} alt="velvet." className="w-[100%]" />
      </div>

      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageFive} alt="ingoude" className="w-[100%]" />
      </div>
      <div className="h-[3.1rem] w-[9.1rem]">
        <Image src={imageSix} alt="habous" className="w-[100%]" />
      </div>
    </div>
  );
}
