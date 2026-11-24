import CartSide from "@/features/cart/components/cart-side";
import Summary from "@/features/summary/components/summary";
import ProductsYouMayLike from "@/features/products/components/products-you-may-like";

export default async function CartPage() {
  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-4 py-8 lg:px-20 lg:py-30">
      <div className="flex flex-col gap-10 xl:flex-row">
        <div className="flex-5">
          <CartSide />
        </div>
        <div className="flex-3">
          <Summary />
        </div>
      </div>
      <div className="flex flex-col gap-6 p-2.5">
        <ProductsYouMayLike />
      </div>
    </section>
  );
}
