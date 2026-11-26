---
description: apiFetch — server-side HTTP client, *.api.ts files, success envelope, and ApiError
globs:
  [
    "src/**/*.api.ts",
    "src/shared/lib/apis/**",
    "src/features/**/lib/apis/**",
    "src/features/**/server/**",
  ]
alwaysApply: false
---

# Calling the API

`apiFetch` in `src/shared/lib/apis/fetch.api.ts` is the only server-side HTTP client. A `*.api.ts` file calls it. Components, hooks, and pages call the exported function from that file. They do not call `apiFetch`.

`apiFetch` is `server-only`. A Client Component cannot import it. A Client Component uses `useSession()` for signed-in state and calls a Server Action. The Server Action, or a Server Component, reads the session with `getServerSession(authOptions)` and passes the access token into the `*.api.ts` function.

## Where the file goes

Put the `*.api.ts` file in `src/shared/lib/apis/` when more than one feature calls it. Otherwise put it in `src/features/<feature>/lib/apis/`.

One exported function per endpoint. A different query, body, or cache option is another argument, not another file.

## Success

`apiFetch<T>` returns `ISuccessResponse<T>` from `src/shared/lib/types/api.d.ts`. `T` is `payload`.

```ts
{
  status: true,
  code: number,
  message: string,
  payload: T
}
```

A paginated list uses `IPaginatedPayload<Item>`. The array is `result.payload.data`.

```ts
const result = await apiFetch<IPaginatedPayload<IProduct>>("/products", {
  query: { limit: 8, sortBy: "rating", sortOrder: "desc" },
  next: { revalidate: 300, tags: ["products"] },
});

const products = result.payload.data;
```

Some successes have no `payload`. Change password returns:

```json
{
  "status": true,
  "code": 200,
  "message": "Your password has been changed successfully."
}
```

Call that as `apiFetch<void>`. `result.payload` is `undefined`. Read `result.message` when the screen needs that sentence.

If the JSON omits `message`, `apiFetch` sets it to `""`. `ISuccessResponse` requires a string.

A 2xx body must still have `status: true` and a numeric `code`. A body missing either one throws `ApiError`.

## Failure

`apiFetch` throws `ApiError`. Do not check `status` again inside the `*.api.ts` file.

`ApiError` carries:

- `status`, the HTTP status
- `code`, the body's `code` when it is a number
- `message`, the body's `message` when it is a string, otherwise the HTTP status text
- `data`, the raw body

A non-2xx HTTP status throws. A 2xx body with `status: false` also throws. Change password's wrong-password body is an `ApiError` with `code: 401` and `message: "Current password is incorrect."`. The `*.api.ts` function lets that error through. The Server Action maps `code === 401` onto the old-password field. The form shows its own translated message.

Newsletter keeps three results in its own function, because the form does not want a thrown error:

- HTTP 201 returns `"subscribed"`.
- HTTP 409, or body `code: 409`, is caught and returned as `"already-subscribed"`.
- HTTP 400 with `errors` is caught and returned as `"error"`. `error.data` still holds `errors`.

## Arguments

`method` is `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, or `"DELETE"`. It defaults to `"GET"`.

`query` is appended to the URL. `undefined` values are skipped.

A plain object `body` is sent as JSON. `FormData`, a string, or a blob is sent as-is. Do not set `Content-Type` on `FormData`.

`Accept` is always `application/json`. A JSON body gets `Content-Type: application/json`.

`auth: token` sends `Authorization: Bearer <token>`. `auth: true` reads the current server session and throws `ApiError` 401 when the access token is missing. Omit `auth` when the endpoint is public.

`cache` and `next` are passed through to `fetch`. Copy the caller's current cache. Do not invent one cache policy for every GET.

```ts
const result = await apiFetch<void>("/users/change-password", {
  method: "POST",
  auth: accessToken,
  body: {
    currentPassword,
    newPassword,
    confirmPassword,
  },
});
```

`result.message` is `"Your password has been changed successfully."` `result.payload` is `undefined`.
