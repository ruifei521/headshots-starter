"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/lib/scroll-to-hash";

/** Scrolls to #anchor after login or in-page hash navigation (e.g. /#pricing). */
export function HashScrollHandler() {
  useEffect(() => {
    scrollToHash();
    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
