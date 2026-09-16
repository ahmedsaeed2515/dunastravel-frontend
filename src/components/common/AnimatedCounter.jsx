import React, { useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * Smoothly animates numbers from 0 to target value when scrolled into view.
 * Direct DOM textContent manipulation avoids hundreds of React re-renders per second,
 * drastically reducing main-thread Total Blocking Time (TBT).
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
}) {
  const ref = useRef(null);
  const targetNumber = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const formatNumber = (num) => {
      if (formatter) return formatter(num);
      return num.toLocaleString();
    };

    // If reduced motion is preferred, jump straight to target value
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${prefix}${formatNumber(targetNumber)}${suffix}`;
      return;
    }

    let animationFrameId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNumber * easeOut);

      if (el) {
        el.textContent = `${prefix}${formatNumber(current)}${suffix}`;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (el) {
        el.textContent = `${prefix}${formatNumber(targetNumber)}${suffix}`;
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { rootMargin: '-20px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetNumber, duration, prefix, suffix, formatter]);

  const formatInitial = (num) => (formatter ? formatter(num) : num.toLocaleString());

  return (
    <span ref={ref} className={className}>
      {prefix}{formatInitial(targetNumber)}{suffix}
    </span>
  );
}
