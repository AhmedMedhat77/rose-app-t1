"use client";

import ProductGallery from "./product-gallery/product-gallery";
import { useProductById } from "../hooks/use-product-id";

export default function ProductOverviewContent({
  productId,
}: {
  productId: string;
}) {
  const { data } = useProductById(productId);
  const images = data?.status ? (data.payload.products[0]?.gallery ?? []) : [];

  return <ProductGallery images={images} />;
}
