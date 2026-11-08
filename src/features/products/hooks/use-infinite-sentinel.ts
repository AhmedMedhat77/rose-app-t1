"use client";

import { useEffect, useRef } from "react";

interface Options {
  onReach: () => void;
  enabled: boolean;
}

export function useInfiniteSentinel({ onReach, enabled }: Options) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;
    if (!enabled || !root || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onReach();
      },
      { root, rootMargin: "50px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, onReach]);

  return { rootRef, sentinelRef };
}
