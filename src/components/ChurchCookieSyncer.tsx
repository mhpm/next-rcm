'use client';

import { useEffect } from 'react';
import { setChurchSlugCookie } from '@/actions/cookies.actions';

interface ChurchCookieSyncerProps {
  userChurchSlug: string | null;
  currentCookieSlug?: string;
}

export function ChurchCookieSyncer({
  userChurchSlug,
  currentCookieSlug,
}: ChurchCookieSyncerProps) {
  useEffect(() => {
    if (userChurchSlug && userChurchSlug !== currentCookieSlug) {
      setChurchSlugCookie(userChurchSlug).catch((err) => {
        console.error('Failed to sync church slug cookie:', err);
      });
    }
  }, [userChurchSlug, currentCookieSlug]);

  return null;
}
