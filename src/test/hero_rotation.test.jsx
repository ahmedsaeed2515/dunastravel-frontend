import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LuxuryHeroSection from '../components/common/LuxuryHeroSection';

const IMAGES = [
  'https://res.cloudinary.com/demo/image/upload/w_1920/a.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_1920/b.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_1920/c.jpg',
];

const renderHero = (props = {}) =>
  render(
    <MemoryRouter>
      <LuxuryHeroSection title="Test Hero" {...props} />
    </MemoryRouter>
  );

const renderedSrcs = (container) =>
  Array.from(container.querySelectorAll('img')).map((img) => img.getAttribute('src') || '');

describe('LuxuryHeroSection gallery rotation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('rotates through the provided bgImages over time', () => {
    const { container, unmount } = renderHero({
      bgImage: IMAGES[0],
      bgImages: IMAGES,
      rotateInterval: 6000,
    });

    // The first frame is shown immediately.
    expect(renderedSrcs(container).some((s) => s.endsWith('a.jpg'))).toBe(true);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(renderedSrcs(container).some((s) => s.endsWith('b.jpg'))).toBe(true);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(renderedSrcs(container).some((s) => s.endsWith('c.jpg'))).toBe(true);

    unmount();
  });

  it('keeps the original single-image behaviour when no bgImages are passed', () => {
    const { container, unmount } = renderHero({ bgImage: IMAGES[0] });

    act(() => {
      vi.advanceTimersByTime(18000);
    });

    const srcs = renderedSrcs(container);
    expect(srcs.some((s) => s.endsWith('a.jpg'))).toBe(true);
    expect(srcs.some((s) => s.endsWith('b.jpg'))).toBe(false);
    expect(srcs.some((s) => s.endsWith('c.jpg'))).toBe(false);

    unmount();
  });

  it('does not rotate when the user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container, unmount } = renderHero({
      bgImage: IMAGES[0],
      bgImages: IMAGES,
      rotateInterval: 6000,
    });

    act(() => {
      vi.advanceTimersByTime(18000);
    });

    const srcs = renderedSrcs(container);
    expect(srcs.some((s) => s.endsWith('a.jpg'))).toBe(true);
    expect(srcs.some((s) => s.endsWith('b.jpg'))).toBe(false);

    unmount();
  });
});
