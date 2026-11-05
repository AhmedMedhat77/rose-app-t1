"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/shared/ui/input";
import { Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { HighlightedText } from "./HighlightedText";
import { IProduct } from "@/features/products/types/product";

export function SearchBar({ products }: { products: IProduct[] }) {
  const t = useTranslations("Header");
  const tSearch = useTranslations("Search");
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const updateDebouncedQuery = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value.trim().toLowerCase());
  }, 300);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(debouncedQuery),
  );

  return (
    <DropdownMenu
      open={isOpen}
      modal={false}
      onOpenChange={(open, details) => {
        if (!open && details.reason === "trigger-press") return;

        setIsOpen(open);
      }}
      onOpenChangeComplete={() => {
        inputRef.current?.focus();
      }}
    >
      <DropdownMenuTrigger
        nativeButton={false}
        render={<div className="relative flex-1" />}
      >
        <Input
          type="search"
          value={query}
          ref={inputRef}
          onChange={(e) => {
            setQuery(e.target.value);
            updateDebouncedQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") e.stopPropagation();
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          autoComplete="off"
          className="h-11 w-full rounded-lg text-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-96 p-0">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-primary px-4 py-3 text-base">
            {filtered.length === 0 && tSearch("title")}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {filtered.length === 0 && (
          <p className="px-4 py-3 text-sm">{tSearch("empty")}</p>
        )}

        {filtered.map((product) => (
          <DropdownMenuItem
            key={product.id}
            className="border-t p-3"
            render={<Link href={`/products/${product.id}`} />}
          >
            <Image
              src={product.cover}
              alt={product.title}
              width={64}
              height={64}
              className="size-16 rounded-lg object-cover"
            />

            <div className="flex flex-1 flex-col gap-1">
              <span className="text-text-plain text-sm font-medium">
                <HighlightedText text={product.title} query={query} />
              </span>
              <span className="text-lg font-semibold">
                {product.price}{" "}
                <span className="text-text-plain text-xs font-normal">
                  {tSearch("currency")}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              <span>{tSearch("rating")}:</span>
              <span className="font-semibold">{product.rating}/5</span>
              <span className="text-text-info">
                ({product.ratings} {tSearch("ratings")})
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
