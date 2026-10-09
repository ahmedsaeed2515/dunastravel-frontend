// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, renderHook, fireEvent } from '@testing-library/react';
import { useTours } from '../hooks/useTours';
import { useTour } from '../hooks/useTour';
import { useCmsBlock } from '../hooks/useCmsBlock';
import { useMedia } from '../hooks/useMedia';
import { useHotel } from '../hooks/useHotels';
import ReviewsMap from '../components/tour/ReviewsMap';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import RouteMap from '../components/tour/RouteMap';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
    i18n: { language: 'es', dir: () => 'ltr' },
  }),
}));

describe('Prompt 02: Tours Catalog, Localization & Reviews Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    // jsdom lacks matchMedia which framer-motion touches while rendering components
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

  it('useTours includes active lang and catalog filters in GET /api/tours', async () => {
    const mockTours = [
      { id: 't-1', slug: 'grand-pyramids', title: 'Grand Pyramids', category: 'classic', basePriceUsd: 1500 },
    ];
    vi.spyOn(api, 'get').mockResolvedValue({ items: mockTours, total: 1, page: 1, limit: 5, totalPages: 1 });

    const { result } = renderHook(() => useTours({ destination: 'egypt', category: 'classic', limit: 5 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/tours?'), expect.anything());
    const callUrl = vi.mocked(api.get).mock.calls[0][0];
    expect(callUrl).toContain('lang=es');
    expect(callUrl).toContain('destination=egypt');
    expect(callUrl).toContain('category=classic');
    expect(callUrl).toContain('limit=5');
    expect(result.current.tours.length).toBe(1);
    expect(result.current.tours[0].slug).toBe('grand-pyramids');
  });

  it('useTour passes active lang parameter and normalizes canonical fields in GET /api/tours/:slug', async () => {
    const mockTour = {
      id: 'tour-greece',
      slug: 'greece-odyssey',
      title: 'Greece Odyssey',
      basePriceUsd: '1200.00',
      currency: 'USD',
      city: 'Athens',
      minPax: '2',
      departureTime: '08:00',
      returnTime: '18:00',
      cancellationPolicy: 'Free cancellation up to 48 hours before start',
      images: [{ id: 'img-1', imageUrl: 'https://example.com/greece.jpg', isHero: true, sortOrder: 0 }],
      itinerary: [
        {
          id: 'it-1',
          sortOrder: 1,
          dayLabel: 'Day 1',
          description: 'Arrival in Athens and Acropolis tour',
          activities: 'Acropolis visit',
          hotels: 'Grand Bretagne',
          notes: 'Wear comfortable shoes',
          transportation: 'Luxury Mercedes Van',
        },
      ],
      includedServices: ['Private Guide', 'Breakfast'],
      excludedServices: ['Tips', 'Flights'],
    };
    vi.spyOn(api, 'get').mockResolvedValue(mockTour);

    const { result } = renderHook(() => useTour('greece-odyssey'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/tours/greece-odyssey?lang=es', expect.anything());
    expect(result.current.tour.title).toBe('Greece Odyssey');
    expect(result.current.tour.city).toBe('Athens');
    expect(result.current.tour.minPax).toBe('2');
    expect(result.current.tour.departureTime).toBe('08:00');
    expect(result.current.tour.returnTime).toBe('18:00');
    expect(result.current.tour.cancellationPolicy).toBe('Free cancellation up to 48 hours before start');
    expect(result.current.tour.itinerary[0].activities).toBe('Acropolis visit');
    expect(result.current.tour.itinerary[0].hotels).toBe('Grand Bretagne');
  });

  it('does not display seed data when the tour API is unavailable', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTour('classic-egypt-pyramids'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.tour).toBeNull();
  });

  it('ReviewsMap uses the verified UUID review contract and never inserts a local review', async () => {
    const mockReviews = [
      { id: 'review-1', reviewerName: 'John Doe', rating: 5, comment: 'Amazing experience!', createdAt: '2026-05-01T00:00:00.000Z' },
    ];
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockReviews, ratingSummary: { averageRating: 5, totalReviews: 1 } });
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });

    const tourId = 'grand-pyramids';
    render(<ReviewsMap tourId={tourId} />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    });

    expect(api.get).toHaveBeenCalledWith(`/tours/${tourId}/reviews`);

    const nameInput = screen.getByLabelText(/Your Name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });

    const reviewInput = screen.getByLabelText(/Your Review/i);
    fireEvent.change(reviewInput, { target: { value: 'Unforgettable tour!' } });

    await waitFor(() => {
      expect(nameInput.value).toBe('Jane Smith');
      expect(reviewInput.value).toBe('Unforgettable tour!');
    });

    const formElement = reviewInput.closest('form');
    fireEvent.submit(formElement);

    // The API is authoritative: no pending review is inserted into the list.
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/tours/${tourId}/reviews`, {
        reviewerName: 'Jane Smith',
        rating: 5,
        comment: 'Unforgettable tour!',
      });
    });
  });

  it('ReviewsMap automatically uses authenticated user profile without requiring manual name input', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [], ratingSummary: { averageRating: 5, totalReviews: 0 } });
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });

    const tourId = 'grand-pyramids';
    const mockAuthUser = { id: 'user-77', name: 'Karim Mostafa', email: 'karim@dunas.com' };

    render(
      <AuthContext.Provider value={{ user: mockAuthUser, isLoading: false }}>
        <ReviewsMap tourId={tourId} />
      </AuthContext.Provider>
    );

    // Verify authenticated user greeting is rendered
    await waitFor(() => {
      expect(screen.getByText('Karim Mostafa')).toBeDefined();
    });

    // Name input should NOT be required for authenticated user
    expect(screen.queryByLabelText(/Your Name/i)).toBeNull();

    // Fill comment and submit
    const reviewInput = screen.getByLabelText(/Your Review/i);
    fireEvent.change(reviewInput, { target: { value: 'Best luxury tour in Egypt!' } });

    const formElement = reviewInput.closest('form');
    fireEvent.submit(formElement);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/tours/${tourId}/reviews`, {
        reviewerName: 'Karim Mostafa',
        rating: 5,
        comment: 'Best luxury tour in Egypt!',
      });
    });
  });

  it('useCmsBlock passes lang to GET /api/cms/:key', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ content: { title: 'Welcome Banner' } });

    const { result } = renderHook(() => useCmsBlock('home_banner'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/cms/home_banner?lang=es', expect.anything());
    expect(result.current.data).toEqual({ title: 'Welcome Banner' });
  });

  it('useMedia fetches official tour gallery photos via GET /api/media/tours/:tourId', async () => {
    const mockMedia = [{ id: 'm-1', secureUrl: '/images/hero.webp', mimeType: 'image/webp' }];
    vi.spyOn(api, 'get').mockResolvedValue(mockMedia);

    const { result } = renderHook(() => useMedia('tour-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/media/tours/tour-123', expect.anything());
    expect(result.current.galleryImages.length).toBe(1);
  });

  it('useMedia fetches category photos via GET /media?category=transport', async () => {
    const mockMedia = [{ id: 'm-2', secureUrl: '/imgs/transportation-hero.png', mimeType: 'image/webp' }];
    vi.spyOn(api, 'get').mockResolvedValue(mockMedia);

    const { result } = renderHook(() => useMedia({ category: 'transport' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/media?category=transport', expect.anything());
    expect(result.current.galleryImages.length).toBe(1);
    expect(result.current.galleryImages[0].url).toBe('/imgs/transportation-hero.png');
  });

  it('useHotel propagates API error and sets hotel to null instead of mock fallback', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Hotel not found'));

    const { result } = renderHook(() => useHotel('non-existent-hotel'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.hotel).toBeNull();
  });

  // ── Interactive Itinerary Journey Map (routeMap) Live Sync ────────────────
  // Dashboard routeMap edits must reach the frontend WITHOUT waiting for the
  // 5min-stale / 30min-TTL cache window. useTour's liveSync polls quietly and
  // swaps in the new tour object without remounting the page.

  it('useTour live sync picks up a dashboard routeMap edit without remount', async () => {
    const baseTour = {
      id: 'tour-live-sync',
      slug: 'live-sync-route-map',
      title: 'Classic Egypt',
      basePriceUsd: '1500.00',
      itinerary: [
        { id: 'it-1', sortOrder: 0, day: 'Day 1', description: 'Cairo Pyramids sightseeing' },
      ],
    };
    // What the dashboard admin just saved inside the Interactive Itinerary Journey Map.
    const updatedTour = {
      ...baseTour,
      routeMapJsonb: {
        titleJsonb: { es: 'Mapa del viaje clásico' },
        subtitleJsonb: { es: 'Explora la ruta' },
        locations: [
          { id: 'loc-1', dbKey: 'cairo', nameJsonb: { es: 'El Cairo' }, lat: 30.0444, lng: 31.2357, daysVisited: [1] },
          { id: 'loc-2', dbKey: 'luxor', nameJsonb: { es: 'Lúxor' }, lat: 25.6872, lng: 32.6396, daysVisited: [2] },
        ],
      },
    };

    const getMock = vi.spyOn(api, 'get');
    let callCount = 0;
    getMock.mockImplementation((url) => {
      callCount += 1;
      // First call = initial page load (no route map yet). Follow-ups = live sync polls.
      return Promise.resolve(callCount === 1 ? baseTour : updatedTour);
    });

    const { result } = renderHook(() => useTour('live-sync-route-map', { liveSyncInterval: 20 }));

    // Live sync silently refetches and swaps the data in — the hook itself never remounts.
    await waitFor(
      () => {
        expect(result.current.tour.routeMapJsonb?.locations?.length).toBe(2);
      },
      { timeout: 3000 }
    );

    // Prove the edit really arrived through a background refetch (not the initial load).
    expect(getMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(getMock).toHaveBeenCalledWith('/tours/live-sync-route-map?lang=es', expect.anything());
    expect(result.current.tour.routeMap.locations[0].nameJsonb.es).toBe('El Cairo');
  });

  // ── RouteMap renders dashboard-supplied custom data ───────────────────────
  it('RouteMap renders custom dashboard routeMap data instead of the auto-generated map', () => {
    const customRouteMap = {
      titleJsonb: { es: 'Mapa del viaje clásico' },
      subtitleJsonb: { es: 'Explora la ruta clásica' },
      locations: [
        { id: 'loc-1', dbKey: 'cairo', nameJsonb: { es: 'El Cairo' }, lat: 30.0444, lng: 31.2357, daysVisited: [1] },
        { id: 'loc-2', dbKey: 'luxor', nameJsonb: { es: 'Lúxor' }, lat: 25.6872, lng: 32.6396, daysVisited: [2] },
      ],
    };

    render(<RouteMap itinerary={[]} highlights={[]} tourTitle="Classic Egypt" routeMap={customRouteMap} />);

    // Custom section heading + subtitle come from the dashboard titleJsonb/subtitleJsonb (lang=es)
    expect(screen.getByRole('heading', { name: 'Mapa del viaje clásico' })).toBeDefined();
    expect(screen.getByText('Explora la ruta clásica')).toBeDefined();

    // Each dashboard location (nameJsonb.es) appears as a journey-map stop with its day label
    expect(screen.getByText('El Cairo')).toBeDefined();
    expect(screen.getByText('Lúxor')).toBeDefined();
    expect(screen.getByText('Día 1')).toBeDefined();
    expect(screen.getByText('Día 2')).toBeDefined();
    expect(screen.getByText('2 Stops')).toBeDefined();
  });
});
