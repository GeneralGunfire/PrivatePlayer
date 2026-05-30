"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Library tab now redirects directly to the Coldplay playlist
 * since it is the only playlist in the collection.
 */
export default function Library() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/playlist/coldplay");
  }, [router]);

  return null;
}
