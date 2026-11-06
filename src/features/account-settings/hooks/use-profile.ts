import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../lib/apis/profile.api";

export const profileKeys = {
  detail: ["profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail,
    queryFn: getProfile,
  });
}
