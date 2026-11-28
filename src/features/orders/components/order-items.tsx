import { useTranslations } from "next-intl";

import { ProductRow } from "@/shared/components/product-row";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

import { VISIBLE_ITEMS_COUNT } from "../lib/constants/order-status.constant";
import type { IOrderItem } from "../lib/types/order.types";

interface OrderItemsProps {
  items: IOrderItem[];
}

interface OrderItemsListProps {
  items: IOrderItem[];
}

function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <ul className="grid gap-2.5 md:grid-cols-2">
      {items.map((item) => (
        <ProductRow
          key={item.id}
          className="bg-bg-subtle rounded-lg border-b-0 pb-0"
        >
          <ProductRow.Image
            src={item.product.cover}
            alt={item.product.title}
            className="rounded-e-none"
          />

          <ProductRow.Content className="py-2.5 pe-2.5">
            <ProductRow.Info>
              <ProductRow.Title className="text-base">
                {item.product.title}
              </ProductRow.Title>
              {item.product.rating !== undefined && (
                <ProductRow.Rating
                  rating={Number(item.product.rating.toFixed(1))}
                  ratings={item.product.ratings ?? 0}
                />
              )}
            </ProductRow.Info>

            <ProductRow.Footer>
              <ProductRow.Price
                price={Number(item.price)}
                quantity={item.quantity}
              />
            </ProductRow.Footer>
          </ProductRow.Content>
        </ProductRow>
      ))}
    </ul>
  );
}

export function OrderItems({ items }: OrderItemsProps) {
  // Translation
  const t = useTranslations("Orders");

  // Variables
  const visibleItems = items.slice(0, VISIBLE_ITEMS_COUNT);
  const hiddenItems = items.slice(VISIBLE_ITEMS_COUNT);

  if (!hiddenItems.length) {
    return (
      <div className="rounded-lg p-3.5">
        <OrderItemsList items={items} />
      </div>
    );
  }

  return (
    <Accordion className="rounded-lg p-3.5">
      <OrderItemsList items={visibleItems} />

      <AccordionItem value="hidden-items" className="group/order-items">
        <AccordionContent className="pt-2.5 pb-0 text-base [&_p:not(:last-child)]:mb-0">
          <OrderItemsList items={hiddenItems} />
        </AccordionContent>

        <div className="relative">
          {/* Faded peek at the next row while collapsed (Figma) */}
          <div
            aria-hidden="true"
            inert
            className="mt-2.5 h-17.5 overflow-hidden group-data-open/order-items:hidden"
          >
            <OrderItemsList items={hiddenItems.slice(0, VISIBLE_ITEMS_COUNT)} />
          </div>

          <AccordionTrigger className="from-bg-plain text-text-maroon **:data-[slot=accordion-trigger-icon]:text-text-maroon absolute inset-0 flex-col items-center justify-end gap-0 rounded-none bg-linear-to-t to-transparent pb-1 group-data-open/order-items:static group-data-open/order-items:bg-none group-data-open/order-items:pt-2.5 hover:no-underline focus-visible:underline **:data-[slot=accordion-trigger-icon]:ml-0">
            <span className="group-aria-expanded/accordion-trigger:hidden">
              {t("showAll")}
            </span>
            <span className="hidden group-aria-expanded/accordion-trigger:inline">
              {t("showLess")}
            </span>
          </AccordionTrigger>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
