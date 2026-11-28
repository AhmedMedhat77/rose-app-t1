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

`apiFetch` in `src/shared/lib/apis/fetch.api.ts` is the only server-side HTTP client. A `*.api.ts` file calls it. Server Components, Route Handlers, and Server Actions call the exported function from that file. They do not call `apiFetch`. Client components and hooks do not import `*.api.ts` or `apiFetch`.

`apiFetch` is `server-only`. A Client Component cannot import it. A Client Component uses `useSession()` for signed-in state. Calling the backend as that user is separate: pass `auth: true`, or pass a token string. Both are allowed, and neither is the default. The client never sees the token. It goes through a Route Handler or a Server Action.

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

`apiFetch` throws `ApiError` on a non-2xx HTTP status, on a 2xx body with `status: false`, and on a 2xx body missing `status: true` or a numeric `code`.

`ApiError` carries:

- `status`, always `false`
- `code`, the HTTP status (`response.status`)
- `message`, the body's `message` when it is a non-empty string, otherwise the HTTP status text, otherwise `"Request failed"`

There is no `data` field. The body's `code` is not copied onto `ApiError`.

A function that loads one item catches a 404 and returns `null`. It does not call `notFound()`. Whether the page calls `notFound()` is TBD by the team. See `nextjs.md`.

```ts
try {
  const { payload } = await apiFetch<{ product: IProduct }>(`/products/${id}`);
  return payload?.product ?? null;
} catch (error) {
  if (error instanceof ApiError && error.code === 404) return null;
  throw error;
}
```

Other errors propagate. Change password lets `ApiError` through. `code` is the HTTP status, so the Server Action maps `code === 401` onto the old-password field. The form shows its own translated message.

Newsletter keeps three results in its own function, because the form does not want a thrown error:

- HTTP 201 returns `"subscribed"`.
- HTTP 409 (`error.code === 409`) is caught and returned as `"already-subscribed"`.
- HTTP 400 (`error.code === 400`) is caught and returned as `"error"`.

## Arguments

`method` is `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, or `"DELETE"`. It defaults to `"GET"`.

`query` is appended to the URL. `undefined` values are skipped.

A plain object `body` is sent as JSON. `FormData`, a string, or a blob is sent as-is. Do not set `Content-Type` on `FormData`.

`Accept` is always `application/json`. A JSON body gets `Content-Type: application/json`.

`auth: token` sends `Authorization: Bearer <token>`. `auth: true` reads the current server session and throws `ApiError` 401 when the access token is missing. Both are allowed, and neither is the default. Omit `auth` when the endpoint is public.

`cache` and `next` are passed through to `fetch`. Copy the caller's current cache. Do not invent one cache policy for every GET. Per-user data uses `cache: "no-store"`. Do not add per-user cache tags.

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
