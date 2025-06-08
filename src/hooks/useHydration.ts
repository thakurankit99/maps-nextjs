'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to handle hydration issues
 * Returns true only after the component has mounted on the client
 * This helps prevent hydration mismatches caused by browser extensions
 * or external scripts that modify the DOM
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
