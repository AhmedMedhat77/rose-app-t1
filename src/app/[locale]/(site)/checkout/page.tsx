import Summary from "@/features/summary/components/summary";
import ProductsYouMayLike from "@/features/products/components/products-you-may-like";

export default async function CheckoutPage() {
  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-20 py-30">
      <div className="flex gap-10">
        <div className="flex-5">
          {/* Checkout Stepper */}
          <h1 className="text-text-plain text-2xl font-semibold">
            Shipping Address
          </h1>
        </div>
        <div className="flex-3">
          <Summary variant="readonly" />
        </div>
      </div>
      <div className="flex flex-col gap-6 p-2.5">
        {/* Product you may like */}
        <ProductsYouMayLike />
      </div>
    </section>
  );
}
