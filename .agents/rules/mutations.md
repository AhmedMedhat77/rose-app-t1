---
description: Mutations flow — Server Action, custom hook with React Query, form component integration
globs:
  [
    "src/features/**/actions/**",
    "src/features/**/lib/actions/**",
    "src/features/**/hooks/**",
    "src/features/**/lib/apis/**",
  ]
alwaysApply: false
---

# Mutations Flow

Always follow this three-layer pattern for mutations triggered from Client Components:

```
Server Action  →  Custom Hook (useMutation)  →  Form / Client Component
```

---

## Layer 1 — Server Action

Auth actions live beside the feature root: `src/features/auth/actions/<scope>.action.ts`.

Other features use `src/features/<feature-name>/lib/actions/<scope>.action.ts`.

```typescript
// src/features/auth/actions/forgot-password.action.ts
"use server";

import { forgotPasswordMutation } from "./mutations";
import { toActionError, type TAuthActionResult } from "./action-result";
import type { TForgotPasswordFormValues } from "../types/forgot-password.types";

export async function forgotPasswordAction(
  values: TForgotPasswordFormValues,
): Promise<TAuthActionResult> {
  try {
    await forgotPasswordMutation(values);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
```

HTTP calls that an action or a Server Component shares go in `src/features/<feature-name>/lib/apis/<scope>.api.ts`. Shared request headers live in `src/app/shared/constants/api.constant.ts` (`HEADERS.JSON_HEADER`). Response types live in `src/app/shared/types/api.d.ts` (`IApiResponse<T>`).

### Refreshing server-fetched data after a mutation (Next 16)

Tag the read, then invalidate that tag from the action.

```typescript
// src/features/products/lib/apis/product.api.ts
const res = await fetch(`${process.env.API}/products`, {
  next: { revalidate: 300, tags: ["products"] },
});

// src/features/products/lib/actions/product.action.ts
("use server");

import { revalidateTag, updateTag } from "next/cache";

// After a successful mutation the user must see right away:
updateTag("products"); // Server Actions only; read-your-writes

// Background refresh, stale data may be served briefly:
revalidateTag("products", "max"); // second argument is required
```

---

## Layer 2 — Custom Hook

Place the hook in `src/features/<feature-name>/hooks/use-<hook-name>.ts`. Export it as a named function.

Handle `onError` inside the mutation.

```typescript
// src/features/auth/hooks/use-forgot-password.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";

import { forgotPasswordAction } from "../actions/forgot-password.action";
import type { TForgotPasswordFormValues } from "../types/forgot-password.types";

export function useForgotPassword() {
  // Navigation
  const router = useRouter();

  // Mutation
  const { isPending, error, mutate } = useMutation({
    mutationFn: (values: TForgotPasswordFormValues) =>
      forgotPasswordAction(values),
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      // Surfaced through `error` in the form
    },
  });

  return { isPending, error, forgotPassword: mutate };
}
```

`useRouter` comes from `@/i18n/navigation`. `useSearchParams` still comes from `next/navigation`.

---

## Layer 3 — Form Component

Place the form in `src/features/<feature-name>/components/<component-name>.tsx`.

Follow the component order in `.agents/rules/clean-code.md`.

```typescript
// src/features/auth/components/forgot-password-request-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { createForgotPasswordSchema } from "../schemas";
import { useForgotPassword } from "../hooks/use-forgot-password";
import type { TForgotPasswordFormValues } from "../types/forgot-password.types";

export default function ForgotPasswordRequestForm() {
  // Translation
  const t = useTranslations("ForgotPassword");

  // Hooks
  const { isPending, forgotPassword } = useForgotPassword();

  // Form
  const form = useForm<TForgotPasswordFormValues>({
    resolver: zodResolver(
      createForgotPasswordSchema({ emailInvalid: t("emailInvalid") }),
    ),
    defaultValues: { email: "" },
  });

  // Functions
  function onSubmit(values: TForgotPasswordFormValues) {
    forgotPassword(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        {...form.register("email")}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
```

---

## APIs vs Actions

|                 | `lib/apis/`                                                    | `actions/`                                 |
| --------------- | -------------------------------------------------------------- | ------------------------------------------ |
| **Runs on**     | Server, when called from a Server Component or a Server Action | Server only (`"use server"`)               |
| **Called from** | Server Components, Server Actions, Route Handlers              | Client Components, through a mutation hook |
| **Use for**     | HTTP reads and shared request functions                        | Mutations triggered from the client        |

Auth is the exception for the folder: its actions are `src/features/auth/actions/`, not `lib/actions/`.

---

## Query Key Factory

Centralize query keys in `src/features/<feature-name>/lib/constants/<scope>.constant.ts`, or in `src/shared/lib/constants/` when more than one feature uses them.

```typescript
// src/features/products/lib/constants/query-keys.constant.ts
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters?: ProductFilters) => ["products", "list", filters] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
} as const;
```

---

## Read Queries (Client-side)

Wrap every `useQuery` call in a custom hook. Never call `useQuery` directly inside a component.

```typescript
// src/features/products/hooks/use-products.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../lib/constants/query-keys.constant";
import { getProducts } from "../lib/apis/product.api";
import type { ProductFilters } from "../lib/types/product.types";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
}
```

---

## Rules Summary

- ✅ Server Actions for mutations triggered from Client Components
- ✅ Custom hook wraps every mutation and query — never call `useMutation` or `useQuery` raw in a component
- ✅ Always handle `onError` in mutation hooks
- ✅ Use `fetch()` — never Axios
- ✅ `lib/apis/` for HTTP calls. Actions for mutations from Client Components
- ✅ Centralize query keys in a constants file
- ✅ After a mutation that affects server-fetched data, call `updateTag(tag)` (or `revalidateTag(tag, "max")` / `revalidatePath`) inside the action
- ❌ Never fetch in `useEffect`
- ❌ Never filter or sort on the client when the server can do it
