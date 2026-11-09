---
description: Forms — Zod schema definitions, React Hook Form patterns, shadcn Form components
paths:
  - "src/features/**/lib/schemas/**"
  - "src/features/**/components/**"
  - "src/shared/lib/schemas/**"
  - "src/shared/components/**"
---

# Forms — React Hook Form + Zod + shadcn

## Schema First

Always define the Zod schema in `features/<feature-name>/lib/schemas/<scope-name>.schema.ts` before writing the form (`features/auth/schemas/` for auth, `shared/lib/schemas/` only for schemas shared across features). Derive the form values type from that schema with `z.infer`. Do not write the same fields again by hand.

Put the derived type in the feature `types/` folder. A field that is not part of the schema, such as `redirectUrl`, goes on a second type that extends the inferred one.

> This file uses **Zod 4** syntax (`z.email()`, `error` instead of `message`). With `@hookform/resolvers`, use v7 or later.

```typescript
// features/auth/lib/schemas/auth.schema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    error: "Passwords do not match",
    path: ["rePassword"],
  });

// features/auth/types/register.types.ts
// The schema above is a const, so `typeof` is the schema object.
export type TRegisterFormValues = z.infer<typeof registerSchema>;

// features/auth/schemas/login.schema.ts
export function createLoginSchema(messages: {
  usernameRequired: string;
  passwordRequired: string;
}) {
  return z.object({
    username: z.string().trim().min(1, messages.usernameRequired),
    password: z.string().min(1, messages.passwordRequired),
  });
}

// features/auth/types/login.types.ts
// `createLoginSchema` is a function, so take its return value before z.infer.
export type TLoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
```

---

## shadcn Form Components

Always use shadcn `<Form>` components with React Hook Form. Never wire up raw native HTML forms.

The shadcn `<Form>` setup provides accessibility, consistent error display, and clean integration with `react-hook-form`'s `control`.

Place form components in `features/<feature-name>/components/<component-name>.tsx`. shadcn's `<Form>` wrapper still works but is no longer actively developed, so keep using it for consistency and don't mix it with `<Field>` in the same project.

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { loginSchema, type LoginFields } from "@/features/auth/lib/schemas/auth.schema";

export function LoginForm() {
  // Translation
  const t = useTranslations("auth");

  // Form
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Functions
  function onSubmit(values: LoginFields) {
    // Pass to mutation hook
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email-label")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("email-placeholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password-label")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("password-placeholder")}
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {t("login")}
        </Button>

      </form>
    </Form>
  );
}
```

---

## Field Comment Structure

Every form field must follow this comment structure:

```typescript
{/* Field name */}
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      {/* Label */}
      <FormLabel>{t("label")}</FormLabel>

      {/* Field */}
      <FormControl>
        <Input {...field} />
      </FormControl>

      {/* Feedback */}
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Form with Mutation Hook

```typescript
export function RegisterForm() {
  // Translation
  const t = useTranslations("auth");

  // Hooks
  const { isPending, register } = useRegister();

  // Form
  const form = useForm<RegistrationFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", rePassword: "" },
  });

  // Functions
  function onSubmit(values: RegistrationFields) {
    register(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* fields */}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Rules Summary

- ✅ All schemas go in `features/<feature-name>/lib/schemas/<scope-name>.schema.ts`
- ✅ Derive form values with `z.infer<typeof schema>`. For a schema factory, use `z.infer<ReturnType<typeof createSchema>>`
- ✅ Always use shadcn `<Form>` + `<FormField>` — never raw HTML forms
- ✅ Always use `zodResolver` — never manual validation
- ✅ Use `form.formState.isSubmitting` or mutation `isPending` to disable submit
- ✅ Server-side errors go to mutation `onError` callback
- ❌ Never use `useState` to track form field values
- ❌ Never access `register()` directly — always use `<FormField>` with `control`
