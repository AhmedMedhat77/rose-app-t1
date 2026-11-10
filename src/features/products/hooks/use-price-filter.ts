"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useFilterUrl } from "./use-filter-url";
import { FILTER_KEYS, PRICE_DEFAULTS } from "../lib/constants/filters.constant";

const DEBOUNCE_MS = 400;

type Field = "min" | "max";

// Helpers
// WHY: Allow digits only and prevent leading zeros.
const sanitize = (v: string) => v.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

const isRangeInvalid = (min: string, max: string) =>
  min !== "" && max !== "" && Number(min) >= Number(max);

export function usePriceFilter() {
  // Hooks
  const { searchParams, update } = useFilterUrl();
  const writeToUrl = useDebouncedCallback((min: string, max: string) => {
    update((p) => {
      if (min === PRICE_DEFAULTS.MIN) p.delete(FILTER_KEYS.MIN_PRICE);
      else p.set(FILTER_KEYS.MIN_PRICE, min);

      if (max === PRICE_DEFAULTS.MAX) p.delete(FILTER_KEYS.MAX_PRICE);
      else p.set(FILTER_KEYS.MAX_PRICE, max);
    });
  }, DEBOUNCE_MS);

  // State
  const urlMin = searchParams.get(FILTER_KEYS.MIN_PRICE) ?? PRICE_DEFAULTS.MIN;
  const urlMax = searchParams.get(FILTER_KEYS.MAX_PRICE) ?? PRICE_DEFAULTS.MAX;

  const [values, setValues] = useState({ min: urlMin, max: urlMax });
  const [lastEdited, setLastEdited] = useState<Field>("min");
  const [synced, setSynced] = useState({ min: urlMin, max: urlMax });

  // WHY: Sync local state when URL changes externally (Reset All, browser navigation).
  if (synced.min !== urlMin || synced.max !== urlMax) {
    setSynced({ min: urlMin, max: urlMax });
    setValues({ min: urlMin, max: urlMax });
  }

  // Functions (handlers)
  function commit(min: string, max: string) {
    setValues({ min, max });

    if (min === "" || max === "" || isRangeInvalid(min, max)) {
      writeToUrl.cancel();
    } else {
      writeToUrl(min, max);
    }
  }

  function setField(field: Field, value: string) {
    setLastEdited(field);
    const next = sanitize(value);

    if (field === "min") commit(next, values.max);
    else commit(values.min, next);
  }

  function resetField(field: Field) {
    if (values[field] !== "") return;

    if (field === "min") commit(PRICE_DEFAULTS.MIN, values.max);
    else commit(values.min, PRICE_DEFAULTS.MAX);
  }

  function reset() {
    // WHY: Prevent pending debounced updates from overwriting the reset.
    writeToUrl.cancel();

    setValues({ min: PRICE_DEFAULTS.MIN, max: PRICE_DEFAULTS.MAX });

    update((p) => {
      p.delete(FILTER_KEYS.MIN_PRICE);
      p.delete(FILTER_KEYS.MAX_PRICE);
    });
  }

  return {
    min: values.min,
    max: values.max,
    setField,
    onBlur: resetField,
    reset,
    isActive:
      values.min !== PRICE_DEFAULTS.MIN || values.max !== PRICE_DEFAULTS.MAX,
    // WHY: Display the error on the last edited field only.
    errorField: isRangeInvalid(values.min, values.max) ? lastEdited : null,
  };
}
