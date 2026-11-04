const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://rose-app.elevate-bootcamp.cloud";

export type SubscribeResult = "subscribed" | "already-subscribed" | "error";

export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeResult> {
  try {
    const response = await fetch(`${API_URL}/api/subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.status === 201) return "subscribed";
    if (response.status === 409) return "already-subscribed";
    return "error";
  } catch {
    return "error";
  }
}
