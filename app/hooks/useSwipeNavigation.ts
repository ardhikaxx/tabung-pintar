"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { useEffect } from "react";

const PAGE_ORDER = ["/", "/standard", "/target", "/emergency"];

export function useSwipeNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = PAGE_ORDER.indexOf(pathname);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < PAGE_ORDER.length - 1) {
        router.push(PAGE_ORDER[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        router.push(PAGE_ORDER[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  return handlers;
}
