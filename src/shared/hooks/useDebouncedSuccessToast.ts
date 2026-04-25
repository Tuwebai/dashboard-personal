import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useDebouncedSuccessToast(message: string, delay = 1500) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      toast.success(message);
    }, delay);
  };
}
