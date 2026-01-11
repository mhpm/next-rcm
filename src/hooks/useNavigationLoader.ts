'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const useNavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isPrintingRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Reset loading state when pathname changes
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    // Intercept router navigation
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Override router methods to show loading
    router.push = (...args) => {
      if (isPrintingRef.current) return originalPush.apply(router, args);
      setIsLoading(true);
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      if (isPrintingRef.current) return originalReplace.apply(router, args);
      setIsLoading(true);
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      if (isPrintingRef.current) return originalBack.apply(router);
      setIsLoading(true);
      return originalBack.apply(router);
    };

    router.forward = () => {
      if (isPrintingRef.current) return originalForward.apply(router);
      setIsLoading(true);
      return originalForward.apply(router);
    };

    // Cleanup
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  useEffect(() => {
    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      if (isPrintingRef.current) return;
      setIsLoading(true);
      // Reset after a short delay to allow for page transition
      setTimeout(() => setIsLoading(false), 300);
    };

    // Handle link clicks
    const handleLinkClick = (e: MouseEvent) => {
      if (isPrintingRef.current) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Only show loading for internal navigation to different pages
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          setIsLoading(true);
        }
      }
    };

    const handleBeforePrint = () => {
      isPrintingRef.current = true;
      setIsLoading(false);
    };

    const handleAfterPrint = () => {
      isPrintingRef.current = false;
      setIsLoading(false);
    };

    const handleWindowFocus = () => {
      // If we were likely printing (or just in general), ensure loading is off when window regains focus
      // This helps if the print dialog doesn't fire afterprint reliably or if execution was paused
      // We check if we were printing to be safe, but actually, focus usually means user is back interacting
      if (isPrintingRef.current) {
        isPrintingRef.current = false;
        setIsLoading(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  return { isLoading, setIsLoading };
};
