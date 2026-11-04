# Rose App

A modern, high-performance web application built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **next-intl**. It features full bilingual support (English & Arabic with first-class RTL layout and localized typography), a robust multi-mode theme system (Light / Dark / System) with cross-tab persistence, and an enterprise-grade feature-based folder architecture.

---

## Table of Contents

- [Rose App](#rose-app)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Quick Start](#quick-start)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Start the Development Server](#2-start-the-development-server)
    - [3. Verification \& Build Commands](#3-verification--build-commands)
  - [Project Architecture \& Feature-Based Folder Structure](#project-architecture--feature-based-folder-structure)
    - [High-Level Directory Overview](#high-level-directory-overview)
    - [Feature-Based Architecture (`src/features`)](#feature-based-architecture-srcfeatures)
      - [Recommended Feature Slice Anatomy](#recommended-feature-slice-anatomy)
    - [Architectural Rules \& Import Boundaries](#architectural-rules--import-boundaries)
    - [Feature Example Walkthrough](#feature-example-walkthrough)
  - [Theme System](#theme-system)
    - [How the Theme Engine Works](#how-the-theme-engine-works)
    - [Theme Modes](#theme-modes)
    - [Using `useTheme` in Client Components](#using-usetheme-in-client-components)
      - [Hook Return Values](#hook-return-values)
    - [Design Tokens \& Tailwind CSS v4](#design-tokens--tailwind-css-v4)
    - [Hydration \& Storage Synchronization](#hydration--storage-synchronization)
  - [React Context Guidelines](#react-context-guidelines)
    - [Context Philosophy](#context-philosophy)
    - [Recipe: Creating a New Context](#recipe-creating-a-new-context)
      - [Copy-Paste Context Template:](#copy-paste-context-template)
    - [Registering Providers](#registering-providers)
  - [Internationalization (i18n) \& Translations](#internationalization-i18n--translations)
    - [Supported Locales \& Typography](#supported-locales--typography)
    - [Directory \& Routing Setup](#directory--routing-setup)
    - [Adding \& Organizing Translations](#adding--organizing-translations)
    - [Using Translations in Server Components](#using-translations-in-server-components)
    - [Using Translations in Client Components](#using-translations-in-client-components)
    - [Navigation \& Routing (Critical Rule)](#navigation--routing-critical-rule)
      - [Switching Locales Programmatically](#switching-locales-programmatically)
    - [RTL (Right-to-Left) Layout Best Practices](#rtl-right-to-left-layout-best-practices)
  - [CI/CD & Git Pre-Commit Automation](#cicd--git-pre-commit-automation)
    - [Pre-Commit Hook Verification](#pre-commit-hook-verification)
    - [GitHub Actions CI Pipeline](#github-actions-ci-pipeline)
    - [GitHub Actions CD Pipeline](#github-actions-cd-pipeline)
    - [Troubleshooting & Fixing Failures](#troubleshooting--fixing-failures)

---

## Tech Stack

| Layer            | Tooling                                                       |
| :--------------- | :------------------------------------------------------------ |
| **Framework**    | Next.js 16 (App Router with Turbopack)                        |
| **Language**     | TypeScript 5                                                  |
| **UI Library**   | React 19 & Base UI primitives (`@base-ui/react`)              |
| **Styling**      | Tailwind CSS v4 with custom design tokens                     |
| **Localization** | `next-intl` (Server + Client, Async Request Config)           |
| **Code Quality** | ESLint 9, Prettier (with Tailwind plugin), Husky, Lint-Staged |

---

## Quick Start

### 1. Install Dependencies

```bash
npm npm install
```

> Running `npm ci` automatically initializes git hooks via Husky's `prepare` script.

### 2. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app automatically detects locale or routes you to the default locale (`/en`).

### 3. Verification & Build Commands

```bash
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

---

## Project Architecture & Feature-Based Folder Structure

The repository uses a **hybrid App Router + Feature-based (domain-driven/vertical slice)** architecture. Next.js App Router handles routing, layouts, and page entry points, while domain-specific logic and UI live inside self-contained feature slices.

### High-Level Directory Overview

```
rose-app/
├── messages/               # Internationalization dictionary JSON files
│   ├── en.json             # English copy
│   └── ar.json             # Arabic copy
├── public/                 # Static assets (images, icons)
│   └── images/             # Product and promotional assets
└── src/
    ├── app/                # Next.js App Router (Routing layer only)
    │   ├── [locale]/       # Localized route segment
    │   │   ├── error.tsx   # Localized error boundary
    │   │   ├── layout.tsx  # Localized root layout (Providers, HTML dir/lang)
    │   │   ├── not-found.tsx
    │   │   └── page.tsx    # Home page entry
    │   ├── fonts.ts        # Google Fonts configuration (Sarabun, Tajawal, Geist)
    │   └── globals.css     # Tailwind v4 configuration, theme colors & tokens
    ├── components/         # Shared, domain-agnostic UI and primitives
    │   ├── ui/             # Atomic design system controls (Button, Dialog, etc.)
    │   ├── locale-switcher.tsx
    │   └── theme-switcher.tsx
    ├── context/            # Shared React context providers & hooks (e.g. Theme)
    ├── features/           # Domain-driven feature slices (Cart, Auth, Catalog...)
    ├── i18n/               # next-intl configuration, routing & navigation helpers
    │   ├── navigation.ts   # Localized Link, useRouter, usePathname
    │   ├── request.ts      # Server request translation loader
    │   └── routing.ts      # Locales list & default locale config
    └── proxy.ts            # Locale negotiation & rewrite proxy middleware
```

### Feature-Based Architecture (`src/features`)

As features grow, keep related code grouped together rather than scattering components, hooks, and types across disconnected folders. Each feature slice inside `src/features/[feature-name]` should encapsulate its own concerns.

#### Recommended Feature Slice Anatomy

```
src/features/cart/
├── components/             # Components private to the cart feature
│   ├── cart-drawer.tsx
│   ├── cart-item-row.tsx
│   └── checkout-summary.tsx
├── hooks/                  # Feature-specific client hooks
│   ├── use-cart-drawer.ts
│   └── use-cart-totals.ts
├── services/               # API clients, server actions, or data fetchers
│   └── cart.api.ts
├── types/                  # TypeScript interfaces and schemas for this domain
│   └── cart.types.ts
├── utils/                  # Domain-specific calculation and transformation helpers
│   └── calculate-discount.ts
└── index.ts                # Public API barrel file (exports allowed outside the feature)
```

### Architectural Rules & Import Boundaries

1. **Keep App Router Pages Thin**:
   - `src/app/[locale]/.../page.tsx` files should be lightweight coordinators. They fetch top-level server data, set metadata, and render the feature's main view component.
   - Example:
     ```tsx
     // src/app/[locale]/cart/page.tsx
     import { CartView } from "@/features/cart";

     export default async function CartPage() {
       return <CartView />;
     }
     ```

2. **Feature Public API via Barrel Exports (`index.ts`)**:
   - Only export what outside features or route pages need (e.g., `<CartView />`, `useCart`). Internal implementation details (like `<CartItemRow />`) should remain private to `src/features/cart/`.

3. **Feature vs. Shared Components (`src/components`)**:
   - Put a component in `src/components/ui/` if it is a **generic primitive** with no business logic (e.g., Button, Modal, Dropdown, Input).
   - Put a component in `src/features/<feature>/components/` if it carries **domain logic or domain data** (e.g., `ProductCard`, `OrderSummary`, `ShippingAddressForm`).

4. **No Deep Cross-Feature Coupling**:
   - Feature A should never import internal files from Feature B (e.g., avoid `import from '@/features/catalog/components/internal-badge'`).
   - If two features need the same UI or utility, hoist it to `src/components/` or `src/utils/`.

### Feature Example Walkthrough

To add a new feature (e.g., `newsletter`):

1. **Create the folder**: `src/features/newsletter/`
2. **Add domain types**: `src/features/newsletter/types/newsletter.types.ts`
3. **Add the UI component**:
   ```tsx
   // src/features/newsletter/components/newsletter-form.tsx
   "use client";

   import { useTranslations } from "next-intl";
   import { Button } from "@/components/ui/button";

   export function NewsletterForm() {
     const t = useTranslations("newsletter");
     return (
       <form className="flex gap-2">
         <input
           type="email"
           placeholder={t("placeholder")}
           className="border-input bg-background rounded-md border px-3 py-2"
           required
         />
         <Button type="submit">{t("subscribe")}</Button>
       </form>
     );
   }
   ```
4. **Expose through barrel export**:
   ```ts
   // src/features/newsletter/index.ts
   export { NewsletterForm } from "./components/newsletter-form";
   ```
5. **Consume anywhere**:
   ```tsx
   import { NewsletterForm } from "@/features/newsletter";
   ```

---

## Theme System

The app includes a zero-flicker, reactive theme system supporting **Light**, **Dark**, and **System** modes with full OS color scheme detection and synchronized browser storage.

### How the Theme Engine Works

1. **CSS Variables & Design Tokens**: All theme colors are declared as CSS variables in [src/app/globals.css](file:///Users/max/Developer/Nextjs/rose-app/src/app/globals.css) within `:root` (light) and `.dark` (dark mode).
2. **Tailwind v4 Integration**: `@custom-variant dark (&:where(.dark, .dark *));` maps Tailwind's `dark:` classes directly to the presence of the `.dark` class on the `<html>` root element.
3. **Active Class Toggling**: The theme provider manages the `.light` and `.dark` classes on `document.documentElement`.
4. **Instant Synchronization**: When a user changes the theme in one tab, the `storage` event updates all other open tabs in real time.

### Theme Modes

| Mode                 | Value      | Behavior                                                                                                                    |
| :------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **System** (Default) | `"system"` | Automatically matches the user's OS preference (`prefers-color-scheme`). Reacts immediately when the OS preference changes. |
| **Light**            | `"light"`  | Explicitly applies the light palette regardless of OS preference.                                                           |
| **Dark**             | `"dark"`   | Explicitly applies the dark palette regardless of OS preference.                                                            |

### Using `useTheme` in Client Components

The theme context is accessible through the `useTheme()` hook from `@/context/theme.context`:

```tsx
"use client";

import { useTheme } from "@/context/theme.context";

export function CustomThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Configured Mode: {theme}</p> {/* "light" | "dark" | "system" */}
      <p>Active Appearance: {resolvedTheme}</p> {/* "light" | "dark" */}
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

#### Hook Return Values

- `theme`: The current user selection (`"light" | "dark" | "system"`).
- `resolvedTheme`: The actual rendered appearance (`"light" | "dark"`). When `theme` is `"system"`, `resolvedTheme` reflects the OS setting.
- `setTheme(mode)`: Function to update the mode. Automatically persists selection to `localStorage` under the key `"rose-theme"`.

### Design Tokens & Tailwind CSS v4

Instead of hardcoding arbitrary hex colors, use the semantic tokens defined in `globals.css`:

```tsx
// Backgrounds
<div className="bg-background">       {/* Default canvas background */}
<div className="bg-card">             {/* Card surfaces */}
<div className="bg-primary">          {/* Primary brand background (maroon/soft-pink) */}
<div className="bg-secondary">        {/* Secondary brand background */}

// Text
<p className="text-foreground">       {/* Main body text */}
<p className="text-muted-foreground"> {/* Muted, softer text */}
<p className="text-primary">          {/* Primary accent text */}

// Borders & Focus Rings
<div className="border-border">       {/* Standard subtle border */}
<button className="focus-visible:ring-ring">
```

### Hydration & Storage Synchronization

- In [src/app/[locale]/layout.tsx](file:///Users/max/Developer/Nextjs/rose-app/src/app/[locale]/layout.tsx), the `<html>` tag includes `suppressHydrationWarning`. This ensures Next.js does not throw hydration mismatch warnings when client JavaScript applies the user's stored dark mode theme after initial server render.
- If localStorage is disabled or restricted in private browsing, `ThemeProvider` safely catches the error and degrades gracefully to `"system"`.

---

## React Context Guidelines

### Context Philosophy

React Context in this project is reserved for **truly global client-side application state** that needs to be accessed by many components at arbitrary tree depths (e.g., Theme, User Session, Cart Drawer state).

> [!TIP]
> Avoid putting server-fetchable data into React Context. Use Server Components and URL query parameters for filter state, pagination, and data loading whenever possible.

### Recipe: Creating a New Context

When creating a new context (e.g., `src/context/cart.context.tsx` or `src/context/ui.context.tsx`), follow this standard pattern:

1. **Mark as `"use client"`**.
2. **Define strict TypeScript types** for state and context API.
3. **Use `useReducer` or `useState`** for predictable state transitions.
4. **Export a custom hook** that asserts the component is wrapped by the provider.

#### Copy-Paste Context Template:

```tsx
// src/context/cart.context.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CartContextValue = {
  isOpen: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext value={{ isOpen, itemCount, openCart, closeCart }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

### Registering Providers

Mount global providers inside [src/app/[locale]/layout.tsx](file:///Users/max/Developer/Nextjs/rose-app/src/app/[locale]/layout.tsx):

```tsx
<ThemeProvider>
  <NextIntlClientProvider>
    <CartProvider>
      {/* App Header, Pages, and Footers */}
      {children}
    </CartProvider>
  </NextIntlClientProvider>
</ThemeProvider>
```

> [!NOTE]
> If a context is only needed for a specific section (e.g. checkout), wrap only that route's sub-layout (`src/app/[locale]/checkout/layout.tsx`) rather than the root layout.

---

## Internationalization (i18n) & Translations

The application uses `next-intl` with full App Router integration, automatic language detection, and complete RTL layout support.

### Supported Locales & Typography

| Locale         | Language         | Direction (`dir`) | Font Variable    | Google Font Family |
| :------------- | :--------------- | :---------------- | :--------------- | :----------------- |
| `en` (Default) | English          | `ltr`             | `--font-sarabun` | Sarabun            |
| `ar`           | Arabic (العربية) | `rtl`             | `--font-tajawal` | Tajawal            |

- The root layout sets `<html lang={locale} dir={dir}>`.
- In `globals.css`, `:root:lang(ar)` automatically swaps the body font to **Tajawal** for optimal Arabic typography and legibility.

### Directory & Routing Setup

- **`messages/en.json` & `messages/ar.json`**: Translation dictionary files.
- **`src/i18n/routing.ts`**: Declares supported locales and the default locale.
- **`src/i18n/request.ts`**: Next.js server configuration that loads the JSON file for the active request.
- **`src/proxy.ts`**: Next.js middleware that matches incoming requests and rewrites/redirects to `/[locale]/...`.

### Adding & Organizing Translations

Translations are organized hierarchically by domain or component name. Always update **both** `messages/en.json` and `messages/ar.json` when adding keys:

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "cart": {
    "title": "Your Cart",
    "empty": "Your cart is currently empty",
    "itemsCount": "{count, plural, =0 {No items} one {1 item} other {# items}}"
  }
}
```

```json
// messages/ar.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء"
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": "سلة التسوق فارغة حالياً",
    "itemsCount": "{count, plural, =0 {لا توجد عناصر} one {عنصر واحد} other {# عناصر}}"
  }
}
```

### Using Translations in Server Components

In Server Components, use `getTranslations` from `next-intl/server`:

```tsx
// src/app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  // Scoped to a specific namespace
  const t = await getTranslations("cart");

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("itemsCount", { count: 3 })}</p>
    </main>
  );
}
```

You can also use `getTranslations` in `generateMetadata`:

```tsx
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("homeTitle"),
  };
}
```

### Using Translations in Client Components

In Client Components (`"use client"`), use the `useTranslations` hook:

```tsx
"use client";

import { useTranslations } from "next-intl";

export function CartSummary() {
  const t = useTranslations("cart");

  return (
    <div>
      <h2>{t("title")}</h2>
      <button>{t("empty")}</button>
    </div>
  );
}
```

### Navigation & Routing (Critical Rule)

> [!IMPORTANT]
> **Never** import `Link`, `useRouter`, `usePathname`, or `redirect` from `next/link` or `next/navigation`.
> Always import them from `@/i18n/navigation`.

```tsx
// ✅ Correct: Maintains the active locale (/en or /ar) automatically
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav>
      {/* Automatically links to /en/products or /ar/products */}
      <Link href="/products">Products</Link>

      <button onClick={() => router.push("/checkout")}>Checkout</button>
    </nav>
  );
}
```

#### Switching Locales Programmatically

To switch locales for the current path, pass the `locale` prop to `<Link>`:

```tsx
import { Link, usePathname } from "@/i18n/navigation";

export function SwitchLanguage() {
  const pathname = usePathname();

  return (
    <div>
      <Link href={pathname} locale="en">
        English
      </Link>
      <Link href={pathname} locale="ar">
        العربية
      </Link>
    </div>
  );
}
```

### RTL (Right-to-Left) Layout Best Practices

When writing styling for bilingual (LTR/RTL) support:

1. **Use Logical Properties**:
   - Prefer `ms-*` (margin-inline-start) and `me-*` (margin-inline-end) over `ml-*` and `mr-*`.
   - Prefer `ps-*` (padding-inline-start) and `pe-*` (padding-inline-end) over `pl-*` and `pr-*`.
   - Prefer `start-*` and `end-*` over `left-*` and `right-*` for absolute positioning.
   - Prefer `text-start` and `text-end` over `text-left` and `text-right`.

2. **Icons with Directionality**:
   - Back and forward arrows (e.g. `ChevronRight`, `ArrowLeft`) must flip in RTL. Use Tailwind's `rtl:` variant:
     ```tsx
     <ArrowRightIcon className="rtl:rotate-180" />
     ```

3. **Flex & Grid**:
   - Standard Flexbox and CSS Grid adapt to `dir="rtl"` automatically. A row container (`flex flex-row`) naturally flows right-to-left in Arabic mode.

---

## CI/CD & Git Pre-Commit Automation

This project implements a multi-tiered validation pipeline:

1. **Local Pre-Commit Hook (Husky + lint-staged)**: Runs before every `git commit` to catch linting, formatting, type, and build issues on the developer's machine before code leaves local branches.
2. **GitHub Actions CI (`.github/workflows/ci.yml`)**: Automatically triggered on pushes and pull requests across multiple branches to validate the codebase in clean isolated Ubuntu containers.
3. **GitHub Actions CD (`.github/workflows/cd.yml`)**: Compiles and verifies production build artifacts on pushes to `main` or release tags.

---

### Pre-Commit Hook Verification

When you run `git commit`, Husky automatically executes `.husky/pre-commit`:

```
git commit -m "feat: add feature"
   │
   ├── 1️⃣ lint-staged: Auto-formats and auto-fixes staged files (ESLint + Prettier)
   │     └─ ❌ Fails? Shows file errors, halts commit.
   │
   ├── 2️⃣ npm run typecheck: Next.js typegen + TypeScript full-project validation
   │     └─ ❌ Fails? Shows TypeScript errors, halts commit.
   │
   └── 3️⃣ npm run build: Full production build compilation
         └─ ❌ Fails? Shows Next.js build errors, halts commit.
   │
   └── ✅ All checks passed -> Commit created!
```

If any check fails, the pre-commit script aborts the commit and outputs actionable error messages:

- **Lint/Format failures**: Run `npm run lint:fix` and `npm run format`.
- **Type errors**: Run `npm run typecheck` to view exact compiler errors.
- **Build errors**: Run `npm run build` to view broken routes or SSR issues.

---

### GitHub Actions CI Pipeline

The CI workflow is defined in [`.github/workflows/ci.yml`](file:///Users/max/Developer/Nextjs/rose-app/.github/workflows/ci.yml).

- **Triggers**:
  - Pushes to `main`, `master`, `develop`, `feat/**`, `fix/**`, `chore/**`
  - Pull Requests targeting `main`, `master`, `develop`
  - Manual trigger via `workflow_dispatch`
- **Features**:
  - **Concurrency Control**: Automatically cancels older in-progress runs when a branch/PR receives new commits.
  - **Dependency Caching**: Caches `~/.npm` and Next.js compiler cache (`.next/cache`) across runs for sub-minute build times.
  - **Explicit Validation Steps**:
    1. Prettier check (`npm run format:check`)
    2. ESLint analysis (`npm run lint`)
    3. TypeScript verification (`npm run typecheck`)
    4. Next.js production build (`npm run build`)
  - **Detailed Step Summary**: Posts a formatted Markdown status report table directly into GitHub's Action summary tab showing each check's individual result.

---

### GitHub Actions CD Pipeline

The CD workflow is defined in [`.github/workflows/cd.yml`](file:///Users/max/Developer/Nextjs/rose-app/.github/workflows/cd.yml).

- **Triggers**: Pushes to `main` or release tags (`v*`).
- **Steps**:
  1. Checks out repository and sets up Node 20.
  2. Restores Next.js build cache.
  3. Executes production build with `NODE_ENV=production`.
  4. Bundles and uploads the production build artifact (`.next/`, `public/`, `package.json`).

---

### Troubleshooting & Fixing Failures

To run the exact checks locally before committing or creating a pull request:

```bash
# 1. Run all checks locally (format, lint, types, build)
npm run check:ci

# 2. Fix formatting issues automatically
npm run format

# 3. Fix auto-fixable ESLint issues
npm run lint:fix

# 4. View TypeScript type issues
npm run typecheck

# 5. Test production build locally
npm run build
```
