import { useEffect } from 'react';

/**
 * Hook to handle clicks/touches outside an element and optional Escape key dismissal.
 * 
 * @param {import('react').RefObject<HTMLElement>} ref - Reference to the target DOM element
 * @param {(event: Event) => void} handler - Callback invoked when an outside click or Escape occurs
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true] - Whether the listeners are active
 * @param {boolean} [options.escapeKey=true] - Whether Escape key triggers handler
 * @param {Array<import('react').RefObject<HTMLElement>>} [options.ignoreRefs=[]] - Refs to ignore
 */
export function useClickOutside(ref, handler, options = {}) {
  const { enabled = true, escapeKey = true, ignoreRefs = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) {
        return;
      }

      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef?.current && ignoreRef.current.contains(event.target)) {
          return;
        }
      }

      handler(event);
    };

    const handleKeyDown = (event) => {
      if (escapeKey && event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    if (escapeKey) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      if (escapeKey) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [ref, handler, enabled, escapeKey, ignoreRefs]);
}

export default useClickOutside;
