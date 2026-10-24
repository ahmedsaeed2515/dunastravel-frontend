// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteMap from '../components/tour/RouteMap';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => {
      const dict = {
        'tour.routeMapTitle': 'خريطة خط سير الرحلة التفاعلية',
        'tour.routeMapSub': 'استكشف مسار رحلتك يوماً بيوم عبر أهم المعالم والمحطات الفاخرة',
      };
      return dict[key] ?? (typeof fallback === 'string' ? fallback : key);
    },
    i18n: { language: 'ar', dir: () => 'rtl' },
  }),
}));

const baseLocation = {
  id: 'loc-1',
  dbKey: 'cairo',
  nameJsonb: { ar: 'القاهرة', en: 'Cairo' },
  lat: 30.0444,
  lng: 31.2357,
  daysVisited: [1],
};

describe('RouteMap section heading localization', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it('uses the Arabic locale when the dashboard stored the English default', () => {
    const routeMap = {
      titleJsonb: {
        ar: 'Interactive Itinerary Journey Map',
        en: 'Interactive Itinerary Journey Map',
      },
      subtitleJsonb: {
        ar: 'Explore your day-by-day path across premier luxury landmarks',
        en: 'Explore your day-by-day path across premier luxury landmarks',
      },
      locations: [baseLocation],
    };

    render(<RouteMap itinerary={[]} highlights={[]} routeMap={routeMap} />);

    expect(screen.getByRole('heading', { name: 'خريطة خط سير الرحلة التفاعلية' })).toBeDefined();
    expect(screen.getByText('استكشف مسار رحلتك يوماً بيوم عبر أهم المعالم والمحطات الفاخرة')).toBeDefined();
  });

  it('keeps a genuine Arabic dashboard override', () => {
    const routeMap = {
      titleJsonb: { ar: 'خريطة رحلتي الخاصة' },
      subtitleJsonb: { ar: 'وصف خاص بالرحلة' },
      locations: [baseLocation],
    };

    render(<RouteMap itinerary={[]} highlights={[]} routeMap={routeMap} />);

    expect(screen.getByRole('heading', { name: 'خريطة رحلتي الخاصة' })).toBeDefined();
    expect(screen.getByText('وصف خاص بالرحلة')).toBeDefined();
  });
});
