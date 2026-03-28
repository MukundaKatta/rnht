"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initBackButton } from "@/lib/capacitor";

/**
 * Initializes Capacitor-specific functionality:
 * - Android hardware back button navigation
 */
export function CapacitorInit() {
  const router = useRouter();

  useEffect(() => {
    initBackButton(() => router.back());
  }, [router]);

  return null;
}
