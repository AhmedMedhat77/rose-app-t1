---
description: Forms — Zod schemas, React Hook Form with Controller, and shadcn Field
paths:
  - "src/features/**/lib/schemas/**"
  - "src/features/**/components/**"
  - "src/shared/lib/schemas/**"
  - "src/shared/components/**"
---

# Forms — React Hook Form + Zod + shadcn

## Schema First

Always define the Zod schema in `features/<feature-name>/lib/schemas/<scope-name>.schema.ts` before writing the form (`shared/lib/schemas/` only for schemas shared across features). Derive the form values type from that schema with `z.infer`. Do not write the same fields again by hand.

Put the derived type in the feature `types/` folder. A field that is not part of the schema, such as `redirectUrl`, goes on a second type that extends the inferred one.

> This file uses **Zod 4** syntax (`z.email()`, `error` instead of `message`). With `@hookform/resolvers`, use v7 or later.

```typescript
// features/auth/lib/schemas/register.schema.ts
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

// features/auth/lib/types/register.types.ts
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

## React Hook Form and Field

Follow the [shadcn React Hook Form guide](https://ui.shadcn.com/docs/forms/react-hook-form). Build each input with `Controller` and `Field` from `@/shared/ui/field`. Do not use the old shadcn `<Form>` / `<FormField>` components.

Place the form in `features/<feature-name>/components/<component-name>.tsx` (kebab-case file, PascalCase function).

```typescript
// features/auth/components/login-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { createLoginSchema } from "@/features/auth/schemas";
import type { TLoginFormValues } from "@/features/auth/types";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

export function LoginForm() {
  // Translation
  const t = useTranslations("Login");

  // Form
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(
      createLoginSchema({
        usernameRequired: t("usernameRequired"),
        passwordRequired: t("passwordRequired"),
      }),
    ),
    defaultValues: { username: "", password: "" },
  });

  // Functions
  function onSubmit(values: TLoginFormValues) {
    // Pass to the mutation hook
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-username">{t("username")}</FieldLabel>
              <Input
                {...field}
                id="login-username"
                aria-invalid={fieldState.invalid}
                autoComplete="username"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t("login")}
        </Button>
      </FieldGroup>
    </form>
  );
}
```

---

## Field Comment Structure

```typescript
{/* Field name */}
<Controller
  name="fieldName"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      {/* Label */}
      <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>

      {/* Field */}
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />

      {/* Feedback */}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Form with Mutation Hook

```typescript
export function RegisterForm() {
  // Translation
  const t = useTranslations("Register");

  // Hooks
  const { isPending, register: submitRegister } = useRegister();

  // Form
  const form = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
    },
  });

  // Functions
  function onSubmit(values: TRegisterFormValues) {
    submitRegister(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Controller fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
```

---

## Rules Summary

- ✅ All features schemas live in `features/<feature-name>/lib/schemas/<scope-name>.schema.ts` (`shared/lib/schemas/` only for schemas shared across features).
- ✅ Derive form values with `z.infer<typeof schema>`. For a schema factory, use `z.infer<ReturnType<typeof createSchema>>`
- ✅ Use `Controller` and `Field` from `@/shared/ui/field`. Do not use shadcn `<Form>` or `<FormField>`
- ✅ Always use `zodResolver`
- ✅ Disable submit with `form.formState.isSubmitting` or the mutation `isPending`
- ✅ Server-side errors go to the mutation `onError` callback
- ❌ Never use `useState` to track form field values
- ❌ Never call React Hook Form's `register()`. Connect inputs with `Controller` and `control`
