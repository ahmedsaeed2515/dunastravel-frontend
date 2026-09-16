import React from 'react';

/**
 * LazyViewportSection
 * Leverages native CSS content-visibility: auto to defer rendering/paint of below-the-fold
 * content without destroying the React component tree or unmounting DOM elements.
 * Preserves 100% SEO, accessibility, internal anchors (#search-section, etc.), and state.
 */
export default function LazyViewportSection({
  children,
  minHeight = '350px',
  className = '',
  id = undefined,
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: `0 ${minHeight}`,
      }}
    >
      {children}
    </section>
  );
}
