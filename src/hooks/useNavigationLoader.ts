'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const useNavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      setIsLoading(true);
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      setIsLoading(true);
      return originalBack.apply(router);
    };

    router.forward = () => {
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
      setIsLoading(true);
      // Reset after a short delay to allow for page transition
      setTimeout(() => setIsLoading(false), 300);
    };

    // Handle link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Only show loading for internal navigation to different pages
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          setIsLoading(true);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  return { isLoading, setIsLoading };
};