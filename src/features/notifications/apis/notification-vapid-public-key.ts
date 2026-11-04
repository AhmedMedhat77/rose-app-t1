const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://rose-app.elevate-bootcamp.cloud";

export async function getVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/notifications/vapid-public-key`);

    if (res.status === 404 || !res.ok) return null;

    const data = await res.json();

    if (!data.pushConfigured) return null;

    return data.publicKey;
  } catch {
    return null;
  }
}
