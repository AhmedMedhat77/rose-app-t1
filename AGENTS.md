<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Architecture Rules

Rose App: a Next.js 16 App Router project. This file holds what every task needs. Topic details live in the rule files listed at the bottom.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Data fetching**: TanStack React Query v5
- **Forms**: React Hook Form v7 + Zod v4.6+ (`@hookform/resolvers` v7+)
- **Auth**: NextAuth **v4** (`next-auth@4.x`). Never use v5 APIs (`auth()`, `handlers`).
- **i18n**: next-intl v4
- **Toasts**: Base UI Toast, custom wrapper in `shared/ui/toast.tsx`.

## Commands

Adjust to the scripts in `package.json`.

```bash
npm run dev          # Start dev server

# Run all quality checks (Format, Lint, TypeScript)
npm run check

# Individual checks
npm run typecheck       # Next typegen & TypeScript validation
npm run lint            # ESLint static analysis
npm run lint:fix        # ESLint auto-fix
npm run format:check    # Check Prettier code formatting
npm run format          # Write Prettier formatting changes
npm run build           # Production build
```

## Folder Structure

```
src/
├── auth.ts                              # Next only: NextAuth config
├── proxy.ts                             # Next only: runs before every request
│
├── i18n/                                # next-intl
│   ├── messages/
│   │   └── <language>.json
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
│
├── providers/
│   └── <name>.provider.tsx
│
├── features/
│   └── <feature-name>/
│       ├── index.ts?                    # public barrel
│       ├── server.ts?
│       ├── components/
│       │   ├── <component-name>.tsx
│       │   └── shared?/
│       │       └── <component-name>.tsx
|       ├── skeletons?/                  # skeleton components related to the route
|       |   └── <component-name>-skeleton.tsx
│       ├── layout?/
│       │   └── <component-name>.tsx
│       ├── screens?/
│       │   └── <screen-name>.tsx
│       ├── hooks?/
│       │   └── use-<hook-name>.ts
│       ├── actions?/                    # used by auth, beside the feature root
│       │   └── <scope-name>.action.ts
│       ├── schemas?/
│       │   └── <scope-name>.schema.ts
│       └── types?/
│       │   ├── <scope-name>.types.ts
│       │   └── <scope-name>.d.ts
│       └── lib?/
│           ├── apis/
│           │   └── <scope-name>.api.ts
│           ├── constants/
│           │   └── <scope-name>.constant.ts
│           ├── schemas/
│           │   └── <scope-name>.schema.ts
│           ├── types/
│           │   ├── <scope-name>.types.ts
│           │   └── <scope-name>.d.ts
│           └── utils/
│               └── <scope-name>.util.ts
│
├── shared/
│   ├── components/
│   │   └── <component-name>.tsx
│   ├── skeletons?/                     # global skeleton components.
│   │   └── <component-name>-skeleton.tsx
│   ├── layout/
│   │   └── <component-name>.tsx
│   ├── context/
│   │   ├── <name>.context.tsx
│   │   └── <name>.provider.tsx
│   ├── hooks/
│   │   └── use-<hook-name>.ts
│   ├── ui/
│   │   └── <component-name>.tsx
│   └── lib/
│       ├── constants/
│       │   └── <scope-name>.constant.ts
│       └── utils/
│           └── <scope-name>.util.ts
│
└── app/
    ├── favicon.ico
    ├── globals.css
    ├── api/
    │   └── auth/
    │       └── [...nextauth]/
    │           └── route.ts
    ├── shared/
    │   ├── constants/
    │   │   └── <scope-name>.constant.ts
    │   └── types/
    │       └── <scope-name>.d.ts
    └── [locale]/                        # localized root
        ├── layout.tsx
        ├── page.tsx
        ├── error.tsx
        ├── not-found.tsx
        ├── (<group>)?/
        │   ├── layout?.tsx
        │   └── <route>/
        │       └── page.tsx
        └── <route>/
            ├── layout?.tsx
            └── page.tsx
```

- A feature never imports from a sibling feature. Promote shared code to `shared/`.
- Route files in `app/` stay thin: import the screen from `features/`.
- Feature skeletons live in `features/<feature-name>/skeletons/`. Shared skeleton pieces live in `shared/skeletons/`. File names end in `.skeleton.tsx`.

---

## Naming Conventions

| Type          | Convention                                                | Example                                                    |
| ------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| Route folders | kebab-case                                                | `account-settings/`                                        |
| Components    | file `<component-name>.tsx`, function PascalCase          | `LoginForm` in `login-form.tsx`                            |
| Hooks         | file `use-<name>.ts`, function `useName`                  | `use-login.ts` exports `useLogin`                          |
| Schemas       | `<scope>.schema.ts`                                       | `login.schema.ts` exports `createLoginSchema`              |
| Actions       | file `<scope>.action.ts`, function `<name>Action`         | `forgot-password.action.ts` exports `forgotPasswordAction` |
| Constants     | file `<scope>.constant.ts`, values `SCREAMING_SNAKE_CASE` | `toast-states.constant.ts` exports `TOAST_STATE`           |
| Types         | `<scope>.types.ts` or `<scope>.d.ts`                      | `profile.types.ts`, `newsletter.d.ts`                      |
| Utilities     | `<scope>.util.ts`                                         | `safe-callback-url.util.ts`                                |

---

## Next.js 16

- `params`, `searchParams`, `cookies()`, and `headers()` are async. Always `await` them.
- `src/proxy.ts` replaces `middleware.ts`. This app default-exports `proxy`, and that function combines auth with next-intl. It runs on the Node.js runtime.
- `fetch` and `GET` route handlers are not cached by default. Opt in with `next: { revalidate, tags }`.
- `revalidateTag(tag, "max")` needs a second argument. Inside a Server Action, `updateTag(tag)` refreshes the data immediately.
- Turbopack is the default bundler. Avoid a custom `webpack()` config.
- `useFormState` is deprecated. Use `useActionState`.
- Lint with `npm run lint`. The `next lint` command is removed.

---

## Import Order

```typescript
// 1. React / Next.js core
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

// 3. Internal aliases
import { Button } from "@/shared/ui/button";
import { createLoginSchema } from "@/features/auth/schemas";

// 4. Relative
import { ProductCard } from "./product-card";
import type { ProductCardProps } from "./types";
```

## Rule files

Read the matching file before working on that topic.

- [Clean code](.agents/rules/clean-code.md) — read before writing any component, hook, or function; component internal order lives here
- [Next.js](.agents/rules/nextjs.md) — read before writing pages, layouts, route handlers, metadata, or any data fetching; Server vs Client components
- [Mutations](.agents/rules/mutations.md) — read before writing Server Actions, React Query mutation hooks, or cache invalidation
- [Forms](.agents/rules/forms.md) — read before writing Zod schemas or a React Hook Form form with shadcn `Field` and `Controller`
- [Components](.agents/rules/components.md) — read before creating a component, skeleton, dialog, or loading/error/empty state
- [i18n](.agents/rules/i18n.md) — read before touching translations, locale routing, navigation imports, or RTL layout
- [Auth](.agents/rules/auth.md) — read before touching NextAuth v4 config, session types, or route protection in `proxy.ts`
