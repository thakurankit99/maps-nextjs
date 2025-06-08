'use client';

import { ReactNode } from 'react';
import { useHydration } from '../hooks/useHydration';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client side
 * This prevents hydration mismatches for content that might be
 * modified by browser extensions or external scripts
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
