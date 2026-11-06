"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FILTER_KEYS } from "../lib/constants/filters.const";

const DEFAULT_MIN = "0";
const DEFAULT_MAX = "1000000";

export function usePriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlMin = searchParams.get(FILTER_KEYS.minPrice) ?? DEFAULT_MIN;
  const urlMax = searchParams.get(FILTER_KEYS.maxPrice) ?? DEFAULT_MAX;

  const [from, setFrom] = useState(urlMin);
  const [to, setTo] = useState(urlMax);

  // آخر قيم URL عملنا لها sync
  const [syncedMin, setSyncedMin] = useState(urlMin);
  const [syncedMax, setSyncedMax] = useState(urlMax);

  // لو الـ URL اتغير عن آخر sync، حدّث الـ state وقت الرسم
  if (urlMin !== syncedMin || urlMax !== syncedMax) {
    setSyncedMin(urlMin);
    setSyncedMax(urlMax);
    setFrom(urlMin);
    setTo(urlMax);
  }

  const isActive =
    searchParams.has(FILTER_KEYS.minPrice) ||
    searchParams.has(FILTER_KEYS.maxPrice);

  const updateUrl = (nextFrom: string, nextTo: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFrom === DEFAULT_MIN) params.delete(FILTER_KEYS.minPrice);
    else params.set(FILTER_KEYS.minPrice, nextFrom);

    if (nextTo === DEFAULT_MAX) params.delete(FILTER_KEYS.maxPrice);
    else params.set(FILTER_KEYS.maxPrice, nextTo);

    router.replace(params.size ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  };

  const handleValuesChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);

    const isValid =
      newFrom !== "" && newTo !== "" && Number(newFrom) < Number(newTo);
    if (isValid) updateUrl(newFrom, newTo);
  };

  const reset = () => {
    setFrom(DEFAULT_MIN);
    setTo(DEFAULT_MAX);
    updateUrl(DEFAULT_MIN, DEFAULT_MAX);
  };

  const isInvalid = from === "" || to === "" || Number(from) >= Number(to);

  return {
    from,
    to,
    setFrom: (val: string) => handleValuesChange(val, to),
    setTo: (val: string) => handleValuesChange(from, val),
    reset,
    isActive,
    isInvalid,
  };
}
