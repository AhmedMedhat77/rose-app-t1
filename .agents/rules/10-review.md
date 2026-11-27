# Project Review Checklist

Use this checklist to review the application for actionable defects and violations. Report findings with a precise location and a specific fix; do not report preferences as defects.

## Severity

- **Critical** — creates a severe security, data-integrity, or availability risk.
- **High** — breaks a core user flow, causes materially incorrect data, or blocks access for users.
- **Medium** — violates a project rule or causes a meaningful accessibility, SEO, performance, or UX regression.
- **Low** — limited-impact inconsistency or maintainability issue with a clear, low-cost fix.

When rules conflict, apply this order: written rules in `nextjs.md` and `api-fetch.md`, then written rules in `mutations.md`, then `components.md`, then code examples. Follow written rules over contradictory examples.

## Data fetching and mutations

- [ ] **High/Medium:** Check that ordinary page data is fetched on the server in async Server Components, using functions exported from `*.api.ts` files and `apiFetch`. Flag client fetching (`useQuery`, `useEffect`, or a Route Handler) unless the data genuinely depends on client state/interactivity or is real-time. A client fetch is a finding even when it works.
- [ ] **High/Medium:** Check that filtering, sorting, and pagination are applied by the server and driven by URL parameters. Flag fetching an unfiltered collection and filtering/sorting/paginating it in the browser.
- [ ] **High/Medium:** Check that client components and hooks do not import `apiFetch` or `*.api.ts` modules. Check that Route Handlers are used only when needed, not as unnecessary proxies for server-side requests.
- [ ] **High/Medium:** Check mutations initiated by client UI use the Server Action → custom mutation hook → component flow, surface errors, and invalidate or update affected server data after success. Flag stale views caused by missing revalidation.
- [ ] **Medium:** Check API response and error handling against the API contract; flag swallowed errors, incorrect status codes, and success-shaped fallbacks that hide failures.

## Performance and rendering

- [ ] **High/Medium:** Check that `"use client"` is limited to the smallest interactive leaf; it must not be added to a page or layout.
- [ ] **Medium:** Check that async server components doing work are placed behind useful Suspense boundaries with loading fallbacks. Flag boundaries that cannot suspend or waterfalls caused by serial requests that could run concurrently.
- [ ] **Medium:** Check all images use `next/image`, have meaningful dimensions (`width`/`height` or `fill` with `sizes`), and that the actual LCP image is prioritized.
- [ ] **Medium:** Check caching is intentional and appropriate: opt in with `revalidate`/tags where useful, avoid caching per-user data, and refresh affected data after mutations.
- [ ] **Medium/Low:** Check for unnecessary heavy dependencies, heavy components that should be dynamically imported, and avoidable renders, duplicated state, or unnecessary memoization.

## Accessibility

- [ ] **High/Medium:** Check every input has an associated visible label; invalid fields expose `aria-invalid` and `aria-describedby` pointing to their error message.
- [ ] **High/Medium:** Check icon-only buttons have accessible names, interactive controls have visible `focus-visible` styles, and all interactions work by keyboard.
- [ ] **High/Medium:** Check dialogs use appropriate dialog primitives and semantics, manage focus, and support keyboard dismissal/navigation.
- [ ] **Medium:** Check text and controls have sufficient color contrast and that interactive elements use semantic `<button>`/`<a>` elements rather than clickable `<div>` or `<span>` elements.
- [ ] **Medium:** Check image alternative text conveys the image's purpose; decorative images have empty alt text.

## SEO and document semantics

- [ ] **High/Medium:** Check every page exports `metadata` or `generateMetadata` with a meaningful title, description, Open Graph data, canonical URL, and locale-appropriate `hreflang` alternates.
- [ ] **Medium:** Check each page has exactly one `<h1>` and a logical, non-skipping heading hierarchy.
- [ ] **Medium:** Check semantic structure uses appropriate landmarks and elements, including `<main>`, `<nav>`, `<section>`, `<article>`, and `<footer>` where applicable.
- [ ] **Medium:** Check `<html>` has the correct `lang` and locale-appropriate `dir`; check robots and sitemap behavior when present.
- [ ] **High:** Check missing-resource behavior uses the right `notFound()` path and HTTP status, and that redirects and error responses return appropriate status codes rather than rendering success responses.

## Logic and correctness

- [ ] **High:** Trace comparisons and identifiers through the UI and data model; flag mismatches such as comparing an ID to a title.
- [ ] **High:** Verify price, discount, totals, and currency calculations against the intended rules; test boundary values and rounding.
- [ ] **High/Medium:** Check null, missing, empty, and malformed values, including empty results and optional fields, do not crash or show incorrect content.
- [ ] **High:** Check pagination uses response metadata and preserves current filters in the URL; verify first/last page and changed-filter behavior.
- [ ] **High:** Check successful mutations refresh all affected data and auth redirects preserve the active locale.

## Conventions and maintainability

- [ ] **Medium:** Check user-facing text uses the project's i18n messages rather than hardcoded strings.
- [ ] **Medium:** Check RTL-sensitive spacing/alignment uses logical Tailwind properties and colors use semantic design tokens rather than raw values.
- [ ] **Medium:** Flag `any` and `console.log`; require typed/narrowed values and remove debug logging.
- [ ] **Medium:** Check collection elements use stable entity keys such as `key={item.id}`, not array indexes (except static placeholders without identity or state).
- [ ] **Medium:** Check feature code lives in the appropriate feature folder and features do not import from sibling features; shared code belongs in `shared/`.

## Report format

| ID  | Category | Severity | File:line | Violated rule | Problem | Suggested fix | Status |
| --- | -------- | -------- | --------- | ------------- | ------- | ------------- | ------ |
