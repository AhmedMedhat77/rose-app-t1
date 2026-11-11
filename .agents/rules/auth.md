---
description: NextAuth v4 — authOptions config, session types, route protection via proxy.ts
paths:
  - "src/auth.ts"
  - "src/proxy.ts"
  - "src/app/api/auth/**"
  - "src/features/auth/**"
  - "src/features/auth/types/next-auth.d.ts"
  - "src/providers/next-auth.provider.tsx"
---

# Authentication — NextAuth v4

This file uses the **v4** API: `authOptions`, `getServerSession`, `getToken`. Do not use v5 APIs (`auth()`, `handlers`, `export const { … } = NextAuth()`).

---

## Config (`src/auth.ts`)

NextAuth options live in `src/auth.ts` and are exported as `authOptions`.

```typescript
// src/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginSchema } from "@/features/auth/lib/schemas/auth.schema";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const res = await fetch(`${process.env.API}/auth/login`, {
          method: "POST",
          body: JSON.stringify(parsed.data),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return null;

        const user = await res.json();

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
};
```

---

## Route Handler for NextAuth

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";

import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

## Type Augmentation

Augment `User` (returned from `authorize`), `Session`, and `JWT`. Without this, strict TypeScript rejects `role` and `token`.

```typescript
// src/features/auth/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    token: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
```

---

## Getting Session

```typescript
// Server Components / Route Handlers / Server Actions
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { redirect } from "@/i18n/navigation";

export default async function ProtectedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect({ href: "/auth/login", locale });

  return <div>Hello, {session.user.name}</div>;
}
```

```typescript
// Client Components
"use client";

import { useSession } from "next-auth/react";

export function UserMenu() {
  // Hooks
  const { data: session, status } = useSession();

  if (status === "loading") return <UserMenuSkeleton />;
  if (!session) return null;

  return <div>{session.user.name}</div>;
}
```

`useSession` needs a `<SessionProvider>` above it. This app wraps that once in `src/providers/next-auth.provider.tsx` and renders it from `src/app/[locale]/layout.tsx`.

```typescript
// src/providers/next-auth.provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

---

## Proxy — Auth + i18n Combined

`middleware.ts` is `proxy.ts` in Next 16. Check the JWT with `getToken`, then hand off to the next-intl middleware.

```typescript
// src/proxy.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes = ["/dashboard", "/profile", "/checkout"];

// Matches protected paths with or without a locale prefix
const protectedPathRegex = new RegExp(
  `^(/(${routing.locales.join("|")}))?(${protectedRoutes.join("|")})(/.*)?$`,
);

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const isProtected = protectedPathRegex.test(req.nextUrl.pathname);

  if (isProtected) {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

If you have auth only and no i18n, this is enough: `export { default } from "next-auth/middleware";`.

---

## Rules Summary

- ✅ Auth options live in `src/auth.ts` as `authOptions`
- ✅ Augment `User`, `Session`, and `JWT` types in `src/features/auth/types/next-auth.d.ts`
- ✅ Protect routes in `src/proxy.ts` — not inside pages
- ✅ Use `getServerSession(authOptions)` on the server
- ✅ Use `useSession()` in Client Components, under `NextAuthProvider` from `src/providers/next-auth.provider.tsx`
- ✅ Use `redirect` from `@/i18n/navigation` with an explicit `locale`
- ❌ Never use v5 APIs (`auth()`, `handlers`) with next-auth v4
- ❌ Never expose raw tokens in session without type augmentation
