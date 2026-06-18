"use client";

import { useEffect, useState } from "react";
import {
  isIosDevice,
  isMobileDownloadContext,
  resolveMobileBatchSize,
  shouldPreferBatchDownload,
} from "@/lib/headshot-download";

export type MobileDownloadProfile = {
  /** Prefer Share sheet / anchor fallback (touch, coarse pointer, narrow). */
  isMobileDownload: boolean;
  /** Show batch UI and block Download All (narrow viewport or iOS). */
  preferBatchDownload: boolean;
  batchSize: number;
  isIos: boolean;
};

function readProfile(): MobileDownloadProfile {
  const preferBatchDownload = shouldPreferBatchDownload();
  return {
    isMobileDownload: isMobileDownloadContext(),
    preferBatchDownload,
    batchSize: resolveMobileBatchSize(preferBatchDownload),
    isIos: isIosDevice(),
  };
}

/** Reactive mobile download UI flags (updates on resize / orientation). */
export function useMobileDownloadProfile(): MobileDownloadProfile {
  const [profile, setProfile] = useState<MobileDownloadProfile>(() =>
    typeof window === "undefined"
      ? { isMobileDownload: false, preferBatchDownload: false, batchSize: 15, isIos: false }
      : readProfile()
  );

  useEffect(() => {
    const update = () => setProfile(readProfile());
    update();

    const narrow = window.matchMedia("(max-width: 767px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    narrow.addEventListener("change", update);
    coarse.addEventListener("change", update);
    window.addEventListener("orientationchange", update);
    window.addEventListener("resize", update);

    return () => {
      narrow.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return profile;
}
