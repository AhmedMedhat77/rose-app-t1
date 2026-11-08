"use client";

import { useEffect, useState } from "react";
import { useFilterUrl } from "./use-filter-url";
import { FILTER_KEYS, PRICE_DEFAULTS } from "../lib/constants/filters.const";

const DEBOUNCE_MS = 400;

// digits only, no leading zeros (blocks "-", "e", ".", letters)
const sanitize = (v: string) => v.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

type Field = "from" | "to";

export function usePriceFilter() {
  const { searchParams, update } = useFilterUrl();

  const urlMin = searchParams.get(FILTER_KEYS.MIN_PRICE) ?? PRICE_DEFAULTS.MIN;
  const urlMax = searchParams.get(FILTER_KEYS.MAX_PRICE) ?? PRICE_DEFAULTS.MAX;

  const [from, setFromState] = useState<string>(urlMin);
  const [to, setToState] = useState<string>(urlMax);
  const [lastEdited, setLastEdited] = useState<Field>("from");
  const [synced, setSynced] = useState({ min: urlMin, max: urlMax });

  // URL changed from outside (Reset All, back button...) -> sync local state
  if (synced.min !== urlMin || synced.max !== urlMax) {
    setSynced({ min: urlMin, max: urlMax });
    setFromState(urlMin);
    setToState(urlMax);
  }

  const isIncomplete = from === "" || to === "";
  const isRangeInvalid = !isIncomplete && Number(from) >= Number(to);

  // Debounced URL write, only for valid values that differ from the URL
  useEffect(() => {
    if (isIncomplete || isRangeInvalid) return;
    if (from === urlMin && to === urlMax) return;

    const id = setTimeout(() => {
      update((p) => {
        if (from === PRICE_DEFAULTS.MIN) p.delete(FILTER_KEYS.MIN_PRICE);
        else p.set(FILTER_KEYS.MIN_PRICE, from);

        if (to === PRICE_DEFAULTS.MAX) p.delete(FILTER_KEYS.MAX_PRICE);
        else p.set(FILTER_KEYS.MAX_PRICE, to);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [from, to, urlMin, urlMax, isIncomplete, isRangeInvalid, update]);

  const reset = () => {
    setFromState(PRICE_DEFAULTS.MIN);
    setToState(PRICE_DEFAULTS.MAX);
    update((p) => {
      p.delete(FILTER_KEYS.MIN_PRICE);
      p.delete(FILTER_KEYS.MAX_PRICE);
    });
  };

  return {
    from,
    to,
    setFrom: (v: string) => {
      setLastEdited("from");
      setFromState(sanitize(v));
    },
    setTo: (v: string) => {
      setLastEdited("to");
      setToState(sanitize(v));
    },
    // empty field on blur -> back to its default
    onBlurFrom: () => from === "" && setFromState(PRICE_DEFAULTS.MIN),
    onBlurTo: () => to === "" && setToState(PRICE_DEFAULTS.MAX),
    reset,
    isActive: from !== PRICE_DEFAULTS.MIN || to !== PRICE_DEFAULTS.MAX,
    // the control the user just edited is the one that shows the error
    errorField: isRangeInvalid ? lastEdited : null,
  };
}
