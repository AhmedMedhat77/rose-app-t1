import Image from "next/image";

interface ProductImageProps {
  image: string;
  title: string;
}

export default function ProductImage({ image, title }: ProductImageProps) {
  return (
    <Image
      src={image}
      alt={title}
      fill
      loading="eager"
      sizes="(max-width: 768px) 100vw, 50vw"
      className="bg-white bg-center object-center"
    />
  );
}
