import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRefreshOnFocus() {
  const router = useRouter();

  useEffect(() => {
    const onFocus = () => {
      router.refresh();
    };

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [router]);
}
