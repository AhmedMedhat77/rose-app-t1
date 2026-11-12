import Image from "next/image";

export default function ProductImage({ image }: { image: string }) {
  return <Image src={image} alt={image} />;
}
