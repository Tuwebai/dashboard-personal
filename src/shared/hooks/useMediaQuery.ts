import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    const frame = window.requestAnimationFrame(() => {
      setMatches(mediaQuery.matches);
    });
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
