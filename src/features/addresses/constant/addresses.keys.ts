export const addressesKeys = {
  all: ["addresses"] as const,

  lists: () => [...addressesKeys.all, "list"] as const,

  details: () => [...addressesKeys.all, "detail"] as const,

  detail: (id: string) => [...addressesKeys.details(), id] as const,
};
