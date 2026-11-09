---
description: Clean code for juniors — names, small functions, DRY, comments, component order, React, errors, CSS, and stack conventions
alwaysApply: true
---

# Clean Code

Priority when rules clash: make it work, then readable, then well-structured.

If you only remember three things: write names the next person can read, keep functions small, and don't repeat yourself. Code is read far more than it is written.

## Names

A good name tells WHAT and WHY without a comment.

```tsx
// ❌
const [data, setData] = useState(null);
const [flag, setFlag] = useState(false);

// ✅
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
```

- Functions are verbs: `getProducts`, `submitOrder`, `isLoading`.
- Booleans start with `is` / `has` / `should`.
- No magic numbers. Name them: `if (day > WORK_DAYS_PER_WEEK)`.
- One word per concept. Do not mix `get` / `fetch` / `retrieve` for the same thing.
- No types inside names (`strName`, `IProduct`). The IDE shows the type.

## Functions

Small. One job. Few arguments. Aim for about 20 lines or less. If a function does several things, those are separate functions it calls.

```tsx
// ❌ does everything
async function submitOrder(form) {
  // validate, format, call API, toast, redirect, log
}

// ✅ each step has a name
async function submitOrder(form: OrderForm) {
  const data = validateOrder(form);
  const payload = formatOrder(data);
  await createOrder(payload);
  notifyOrderPlaced();
  redirectToConfirmation();
}
```

- No boolean flag arguments. `renderItem(item, true)` means two jobs. Split into `renderActiveItem` and `renderInactiveItem`.
- Prefer one object argument over many positional ones.
- A function either answers a question or does an action. Never both.
- No hidden side effects. `addProduct` only adds a product.

## DRY

Copy-paste is the main source of bugs. Make it work first, then refactor.

- Repeated JSX → reusable component
- Repeated logic → utility function
- Repeated `useEffect` or state logic → custom hook

## Comments

Default: don't write one. A good name is better.

Avoid comments that restate the code, commented-out code, "fixed a bug" diary notes, and JSDoc on every function.

Use section headers over a group of lines (`// State`, `// Effects`), `// WARNING:` or `// TODO:` with real context, and comments that explain a non-obvious WHY.

## Component structure

Declare things in this order, with a section comment above each group that is present:

Translation → Navigation → State → Ref → Context → Hooks → Query → Mutation → Form → Variables → Functions → Effects

```tsx
function ProductCard({ id }: { id: string }) {
  // Translation
  const t = useTranslations("ProductCard");

  // Navigation
  const router = useRouter();

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Ref
  const cardRef = useRef<HTMLDivElement>(null);

  // Context
  const { currency } = useContext(StoreContext);

  // Hooks
  const { isFavorite, toggleFavorite } = useFavorite(id);

  // Query
  const { data: product } = useSuspenseQuery(productQuery(id));

  // Mutation
  const { mutate: addToCart } = useMutation({ mutationFn: addToCartAction });

  // Form
  const form = useForm({ resolver: zodResolver(reviewSchema) });

  // Variables (derived)
  const formattedPrice = formatPrice(product.price, currency);

  // Functions (handlers)
  const handleAddToCart = () => addToCart(id);

  // Effects (rare, last)
  useEffect(() => {
    /* ... */
  }, []);

  return null;
}
```

## React

Derive, don't duplicate. If you can compute it, don't store it.

```tsx
// ❌
const [items, setItems] = useState<Item[]>([]);
const [itemCount, setItemCount] = useState(0);

// ✅
const [items, setItems] = useState<Item[]>([]);
const itemCount = items.length;
```

- Use props directly, or derive from them. Do not copy props into state.
- `useEffect` should be rare. If it only syncs derived state, compute it during render.
- Several state pieces that change together → `useReducer`.
- `useMemo`, `useCallback`, and `memo` only when needed.
- Values that do not depend on props or state belong outside the component.
- Use `<>...</>` when no wrapper element is needed.
- Use local state when it is enough. Reach for context only when it is shared.

## Errors and types

- Use `async`/`await`, not `.then()` chains.
- Handle errors in one shared place, not a `try/catch` in every component.
- Show the user a message they understand. Never a raw error.
- Use optional chaining (`a?.b?.c`) for possibly missing values.
- Never use `any`. Type from the API response, or use `unknown` and narrow. TypeScript strict mode stays on.

## CSS and HTML

- One styling approach for the project: Tailwind.
- Flexbox when content shapes the layout (navbar, row of items). Grid when the layout shapes the content (page templates, card grids).
- Avoid `!important`. Fix specificity instead.
- Semantic HTML: `button`, `nav`, `section`. Do not use `div` for everything.
- Prefer `min()`, `max()`, `clamp()`, and `auto-fit` over piles of media queries.

## Project stack

- **Next.js 16 App Router:** the middleware file is `proxy.ts`. Server Components by default. Push `"use client"` down to the smallest interactive leaf. Never on a whole page.
- **Tailwind v4:** semantic tokens only (`bg-primary`, `text-destructive`, `border-ring`). Never raw hex. Reusable components are `w-full` and sized by the parent. No baked-in widths such as `w-82`.
- **shadcn/ui:** use it for primitives.
- **next-intl:** locales are `/en` and `/ar`. Message keys are nested one level (`Login.username`). Never hardcode user-facing strings. For RTL, use logical properties (`ps-`, `pe-`, `ms-`, `me-`, `inset-s-0`).
- **Forms:** React Hook Form + Zod. One schema, shared resolver, no manual validation state.
- **Server state:** React Query. Gate devtools behind `process.env.NODE_ENV === "development"`.
- **Structure:** feature folders under `src/features/`. Kebab-case route folders and component file names. Component functions stay PascalCase (`LoginForm` in `login-form.tsx`). One alias: `@/` → `src/`.
- **Accessibility:** a `label` linked to each input, `aria-label` on icon-only buttons, visible `focus-visible` states, and `aria-invalid` plus `aria-describedby` on error fields.

## Before you finish

- Names tell what the code does.
- Each function does one thing.
- Copy-paste that should be a component, hook, or util has been extracted.
- No `any`, no hardcoded user-facing strings, no raw colors.
- No `useEffect` that a derived value can replace.
- No commented-out code or `console.log`.
