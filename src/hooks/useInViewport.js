import { useState, useEffect, useRef } from 'react';

/**
 * Reusable IntersectionObserver hook for viewport-idle animations, maps, and marquees.
 * 
 * @param {Object} options
 * @param {number} [options.threshold=0.05] - Target visibility ratio to trigger
 * @param {string} [options.rootMargin="0px"] - Margin around root element
 * @param {boolean} [options.once=false] - If true, stays visible once triggered
 * @returns {[import('react').RefObject<HTMLElement>, boolean]} [ref, isVisible]
 */
export function useInViewport(options = {}) {
  const { threshold = 0.05, rootMargin = '0px', once = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return undefined;

    // Support server-side rendering or environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(node);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [targetRef, isVisible];
}

export default useInViewport;
