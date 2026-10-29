import { useEffect, useRef } from 'react';

export function useAutoScroll(dependency) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [dependency]);

  return ref;
}
