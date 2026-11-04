const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://rose-app.elevate-bootcamp.cloud";

export async function sendSubscriptionToServer(subscription: PushSubscription) {
  const res = await fetch(`${API_URL}/api/notifications/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!res.ok) throw new Error("Failed to save subscription");
}

export async function deleteSubscriptionFromServer(endpoint: string) {
  const res = await fetch(`${API_URL}/api/notifications/subscriptions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
  if (!res.ok) throw new Error("Failed to delete subscription");
}
