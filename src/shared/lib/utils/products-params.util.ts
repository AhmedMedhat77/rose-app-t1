export type NextSearchParams = Record<string, string | string[] | undefined>;

export function getSearchParams(searchParams: NextSearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  return params;
}
