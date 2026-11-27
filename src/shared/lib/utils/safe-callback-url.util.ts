export function getSafeCallbackUrl(
  callbackUrl: string | null,
): string | undefined {
  if (!callbackUrl) return undefined;

  const isSafeCallbackUrl =
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !/[\\\t\r\n]/.test(callbackUrl);

  return isSafeCallbackUrl ? callbackUrl : undefined;
}
