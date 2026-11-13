"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;
let isMobile = false;

export function useIsMobile() {
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    };
    mql.addEventListener("change", onChange);
    isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
