"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/ui/badge";

import { isNewProduct } from "../lib/utils/is-new-product.util";

// nothing to subscribe to, the value only has to be read on the client
const subscribe = () => () => {};

export function NewBadge({ createdAt }: { createdAt?: string | null }) {
  const t = useTranslations("Product");

  // the server (build, SSR) always gets false, the browser computes the real value
  const isNew = useSyncExternalStore(
    subscribe,
    () => Boolean(createdAt) && isNewProduct(createdAt as string),
    () => false,
  );

  if (!isNew) return null;

  return (
    <Badge
      variant="subtle"
      className="bg-bg-muted text-text-zinc-700 dark:bg-bg-inverse dark:text-text-inverse"
    >
      <span>{t("new")}</span>
    </Badge>
  );
}
