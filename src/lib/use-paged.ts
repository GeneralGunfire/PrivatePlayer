import { useState, useCallback } from "react";

const PAGE = 10;

export function usePaged<T>(items: T[], initial = PAGE) {
  const [visible, setVisible] = useState(initial);
  const loadMore = useCallback(() => setVisible(v => Math.min(v + PAGE, items.length)), [items.length]);
  const reset    = useCallback(() => setVisible(initial), [initial]);
  return {
    items:    items.slice(0, visible),
    hasMore:  visible < items.length,
    remaining: items.length - visible,
    loadMore,
    reset,
    total: items.length,
  };
}
