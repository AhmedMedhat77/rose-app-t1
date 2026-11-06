"server-only";

// Shared result for client-invoked auth server actions. Mutations throw on
// failure; actions catch and return a serializable result the client can
// branch on (thrown errors are masked across the action boundary in prod).
export type TAuthActionResult =
  { success: true } | { success: false; message: string };

export function toActionError(error: unknown): TAuthActionResult {
  return {
    success: false,
    message: error instanceof Error ? error.message : "Unknown error",
  };
}
