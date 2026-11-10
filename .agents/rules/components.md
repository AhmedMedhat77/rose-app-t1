---
description: Component architecture — categories, structure, skeletons, loading/error/empty states
paths:
  - "src/features/**/components/**"
  - "src/features/**/layout/**"
  - "src/features/**/skeletons/**"
  - "src/shared/**"
  - "src/shared/skeletons/**"
---

# Component Architecture

## Component Categories

| Folder                                | Purpose                                           | Example                                    |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| `shared/components/`                  | Generic, small, highly reusable, no feature logic | `headline.tsx`, `section-wrapper.tsx`      |
| `features/<feature-name>/components/` | Feature-specific, less customizable               | `product-card.tsx`, `cart-summary.tsx`     |
| `features/<feature-name>/skeletons/`  | Feature skeleton loaders                          | `product-card.skeleton.tsx`                |
| `shared/skeletons/`                   | Base skeleton building blocks                     | `bar.skeleton.tsx`, `circle.skeleton.tsx`  |
| `shared/layout/`                      | Global persistent UI                              | `navbar.tsx`, `footer.tsx`                 |
| `features/<feature-name>/layout/`     | Feature-level layout UI                           | `auth-header.tsx`, `dashboard-sidebar.tsx` |
| `shared/ui/`                          | shadcn generated — never edit                     | `button.tsx`, `input.tsx`                  |

`app/` contains only route files (`page.tsx`, `layout.tsx`, `loading.tsx`, …). Components live in `features/` or `shared/`, never in `app/`.

Set the shadcn `components.json` aliases to match: `ui` → `@/shared/ui`, `components` → `@/shared/components`, `utils` → `@/shared/lib/utils/cn.util`.

---

## Props Pattern

Every component that accepts props must have an explicit typed interface. Always pass all required props — never assume defaults unless the prop is explicitly marked optional.

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
}: ProductCardProps) {
  // ...
}
```

---

## Loading / Error / Empty States

Every data-driven component must handle all three states:

```typescript
// features/products/components/product-list.tsx
"use client";

export function ProductList({ filters }: { filters: ProductFilters }) {
  // Queries
  const { data: products, isLoading, isError } = useProducts(filters);

  // Loading state
  if (isLoading) return <ProductListSkeleton />;

  // Error state
  if (isError) return <ErrorState message="Failed to load products" />;

  // Empty state
  if (!products?.length) return <EmptyState title="No products found" />;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
```

---

## Skeleton Pattern

Create a skeleton for every data-driven component. Place it in `features/<feature-name>/skeletons/<component-name>.skeleton.tsx`.

Build feature skeletons from the base pieces in `shared/skeletons/`, which themselves use `shared/ui/skeleton`.

```typescript
// shared/skeletons/bar.skeleton.tsx
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils/cn.util";

interface BarSkeletonProps {
  className?: string;
}

export function BarSkeleton({ className }: BarSkeletonProps) {
  return <Skeleton className={cn("h-4 rounded", className)} />;
}

// features/products/skeletons/product-card.skeleton.tsx
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { BarSkeleton } from "@/shared/skeletons/bar.skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="space-y-2 p-4">
        <BarSkeleton className="w-3/4" />
        <BarSkeleton className="w-1/2" />
      </CardContent>
    </Card>
  );
}

// Feature list skeleton
export function ProductListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Index as key is acceptable here — items are static placeholders with no identity or state */}
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
```

---

## Suspense Wrapping (Server Components)

When a component fetches data server-side, the parent wraps it in `<Suspense>` with a skeleton fallback. The fetching component must be `async`.

```typescript
// app/[locale]/products/page.tsx — Server Component, no "use client"
import { Suspense } from "react";

import { ProductList } from "@/features/products/components/product-list";
import { ProductListSkeleton } from "@/features/products/skeletons/product-list.skeleton";

export default function ProductsPage() {
  return (
    <section>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </section>
  );
}

// features/products/components/product-list.tsx — must be async
import { getProducts } from "@/features/products/lib/services/product.service";

export async function ProductList() {
  const products = await getProducts();
  // ...
}
```

---

## Dialog Pattern

```typescript
// shared/components/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { buttonVariants } from "@/shared/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={
              variant === "destructive"
                ? buttonVariants({ variant: "destructive" })
                : ""
            }
          >
            {isPending ? "Loading..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Rules Summary

- ✅ Match the component to its correct category folder
- ✅ Every data-driven component handles loading, error, and empty states
- ✅ Every data-driven component has a matching skeleton in `skeletons/`
- ✅ All required props must always be passed — unless explicitly optional
- ✅ Use `key={item.id}` — never `key={index}`
- ✅ Accept and forward `className` prop for composability
- ❌ Never use `React.FC` type — use regular function declarations
- ❌ Never import from a sibling feature folder — promote to `shared/components/`
- ❌ Never edit files inside `shared/ui/`
