---
description: Next.js 16 App Router — Server vs Client components, data fetching strategy, Route Handlers, Suspense, metadata
globs: ["src/app/**/*.tsx", "src/app/**/*.ts", "src/proxy.ts"]
alwaysApply: false
---

# Next.js 16 App Router Rules

## Server vs Client Components

Default to Server Components. Add `"use client"` only when the component needs:

- Event listeners (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Third-party client-only libraries

**Never place `"use client"` on a page or layout.** Keep pages as Server Components and extract the interactive part into `src/features/<feature-name>/components/`.

```typescript
// ✅ src/app/[locale]/products/page.tsx — stays a Server Component
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

// ✅ src/features/products/components/add-to-cart-button.tsx — client boundary
"use client";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

---

## Data Fetching Strategy

**Default: server-side fetching** — call `lib/apis` functions in async Server Components and wrap with `<Suspense>`.

**Client-side fetching** — only when data depends on client state, interactivity, or real-time updates. In these cases, use a Route Handler (`app/api/`) and React Query.

**Never use Axios** — use the native `fetch()` API. Next.js extends `fetch` with caching, revalidation, and deduplication. **Caching is opt-in:** since Next 15, `fetch` is not cached by default. Add `next: { revalidate: N }` or `next: { tags: [...] }` where you want it.

```typescript
// ✅ Server Component with Suspense
// src/app/[locale]/products/page.tsx
import { Suspense } from "react";

import { ProductList } from "@/features/products/components/product-list";
import { ProductListSkeleton } from "@/features/products/skeletons/product-list.skeleton";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  );
}

// src/features/products/components/product-list.tsx — async, so Suspense works
import { getProducts } from "@/features/products/lib/apis/product.api";

export async function ProductList() {
  const products = await getProducts();
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

**Suspense only works when the child component is `async` and returns a Promise.** A non-async component wrapped in `<Suspense>` has no effect.

---

## Mutations Strategy

Always use **Server Actions** for mutations (create, update, delete).

When the mutation is triggered from a **Client Component**, combine the Server Action with a **React Query mutation** via a custom hook for better caching, revalidation, and UX.

Flow: **Server Action → Custom Hook (useMutation) → Form/Client Component**

See `mutations.md` for the full pattern.

---

## Route Handlers (`app/api/`)

Use Route Handlers only when you need to avoid exposing sensitive information (tokens, API URLs) on the client. Do not create a Route Handler for every endpoint — server-side fetching directly in Server Components is preferred. `GET` handlers are not cached by default (since Next 15); opt in with `export const dynamic = "force-static"` only if you need it.

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

import { HEADERS } from "@/app/shared/constants/api.constant";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";

  const res = await fetch(`${process.env.API}/products?page=${page}`, {
    headers: { ...HEADERS.JSON_HEADER },
  });

  const data = await res.json();

  return NextResponse.json(data);
}
```

---

## App Directory Files

| File               | Purpose                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `layout.tsx`       | Persistent shell — wraps all children, never re-renders on navigation                                    |
| `page.tsx`         | Route content — required in every route segment                                                          |
| `loading.tsx`      | Shown while server-side promises are pending (auto Suspense boundary)                                    |
| `error.tsx`        | Catches errors in the segment — must be `"use client"`                                                   |
| `not-found.tsx`    | Shown when `notFound()` is called inside the segment                                                     |
| `global-error.tsx` | Optional root error catch at `src/app/`. This app handles segment errors in `src/app/[locale]/error.tsx` |

```typescript
// src/app/[locale]/error.tsx
"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Metadata

Export `metadata` or `generateMetadata` from every page:

```typescript
// Static metadata
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our catalog",
};

// Dynamic metadata — `params` is a Promise in Next 15+, so await it
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.name,
    description: product.description,
  };
}
```

---

## Server-Side Search (URL-based)

Search inputs must write to the URL (not local state) and must be debounced. Data must be fetched already filtered from the server — never fetch all data and filter in memory on the client.

```typescript
// ✅ URL-driven search with debounce
"use client";

import { useSearchParams } from "next/navigation";         // useSearchParams is NOT locale-specific
import { useDebouncedCallback } from "use-debounce";
import { useRouter, usePathname } from "@/i18n/navigation"; // useRouter & usePathname ARE locale-specific

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounced to avoid a request on every keystroke
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <input
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

On the server side, `searchParams` is a Promise in pages (Next 15+). Await it, and wrap any client component that calls `useSearchParams` in `<Suspense>` (the build fails otherwise on statically rendered routes).

```typescript
// src/app/[locale]/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      <Suspense>
        <SearchInput />
      </Suspense>
      <Suspense key={q} fallback={<ProductListSkeleton />}>
        <ProductList query={q} />
      </Suspense>
    </>
  );
}
```

---

## Images

Always use `next/image` — never use the plain `<img>` tag. The Next.js `<Image>` component provides automatic optimization, lazy loading, WebP/AVIF output, CLS prevention, and better Core Web Vitals.

```typescript
// ✅ Good
import Image from "next/image";

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  className="object-cover"
/>

// For fill containers
<div className="relative aspect-square">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>

// ❌ Bad
<img src={product.imageUrl} alt={product.name} />
```

**Next 16 image config notes:**

- Remote images must be allowed in `next.config.ts` via `images.remotePatterns` (`images.domains` is deprecated).
- Local images with a query string (`/img.png?v=2`) require `images.localPatterns`.
- Only `quality={75}` is allowed by default; other values need `images.qualities`.

---

## Next.js 16 Reminders

The short list lives in `AGENTS.md`. `src/proxy.ts` default-exports `proxy`. Cache invalidation details are in `mutations.md`.
