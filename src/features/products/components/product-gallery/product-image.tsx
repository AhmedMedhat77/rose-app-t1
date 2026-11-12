import Image from "next/image";

export default function ProductImage({ image }: { image: string }) {
  return (
    <Image
      src={image}
      alt="Product photo"
      fill
      priority
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
    />
  );
}
