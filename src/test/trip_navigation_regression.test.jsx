// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPageDetails from '../pages/destinations/LandingPageDetails';
import Egipto from '../pages/destinations/Egipto';
import BackendToursPage from '../pages/tours/BackendToursPage';
import MultiCountryTours from '../pages/programs/MultiCountryTours';
import ExtensionTours from '../pages/programs/ExtensionTours';
import ExtensionDetails from '../pages/programs/ExtensionDetails';
import Honeymooners from '../pages/programs/Honeymooners';
import HoneymoonersDetails from '../pages/programs/HoneymoonersDetails';
import TourDetails from '../pages/tours/TourDetails';
import DurationSortFilter from '../components/common/DurationSortFilter';
import api from '../utils/api';
import { clearAllCache } from '../utils/apiCache';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: {
      language: 'en',
      dir: () => 'ltr',
    },
  }),
}));

vi.mock('../context/CurrencyContext', () => ({
  useCurrency: () => ({
    formatPrice: (price) => `$${price}`,
    convertPrice: (amt) => Number(amt) || 0,
    currency: 'USD',
  }),
}));

vi.mock('../hooks/useWishlist', () => ({
  useWishlist: () => ({
    isFavorite: () => false,
    toggleFavorite: vi.fn(),
  }),
}));

const MOCK_TOURS_BY_SLUG = {
  'jordan-petra-wonders-7d': {
    id: 'tour-jordan-1',
    slug: 'jordan-petra-wonders-7d',
    title: 'Jordan Petra & Wadi Rum Wonders',
    overview: 'Seven days of private luxury across Amman, Petra, Wadi Rum, and the Dead Sea.',
    destination: 'jordan',
    country: 'Jordan',
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    basePriceUsd: 1850,
    price: 1850,
    currency: 'USD',
    heroImage: 'https://example.com/jordan.jpg',
    images: ['https://example.com/jordan.jpg'],
    itinerary: [
      { day: 1, title: 'Arrival in Amman', description: 'VIP airport meet and assist.' },
      { day: 2, title: 'Rose City of Petra', description: 'Private guided tour of the Treasury.' },
    ],
    includedServices: ['5-Star Hotels', 'Private Chauffeur'],
    excludedServices: ['International Flights'],
    highlights: ['Petra Treasury', 'Wadi Rum Luxury Camp'],
  },
  'complete-egypt-8d': {
    id: 'tour-egypt-1',
    slug: 'complete-egypt-8d',
    title: 'Complete Egypt Classic 8 Days',
    overview: 'Explore the Great Pyramids of Giza and sail on a 5-star Nile Cruise from Luxor to Aswan.',
    destination: 'egypt',
    country: 'Egypt',
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    basePriceUsd: 1290,
    price: 1290,
    currency: 'USD',
    heroImage: 'https://example.com/egypt.jpg',
    images: ['https://example.com/egypt.jpg'],
    itinerary: [
      { day: 1, title: 'Cairo Arrival', description: 'Welcome to Cairo.' },
      { day: 2, title: 'Giza Pyramids & Sphinx', description: 'Private Egyptologist tour.' },
    ],
    includedServices: ['Deluxe Nile Cruise', 'Domestic Flights'],
    excludedServices: ['Personal Expenses'],
    highlights: ['Pyramids of Giza', 'Karnak Temple'],
  },
  'classic-program': {
    id: 'tour-classic-program',
    slug: 'classic-program',
    title: 'Classic Egypt Programme',
    overview: 'Timeless wonders of Cairo, the Pyramids and a luxury Nile Cruise.',
    destination: 'egypt',
    country: 'Egypt',
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    basePriceUsd: 1890,
    price: 1890,
    currency: 'USD',
    heroImage: 'https://example.com/classic.jpg',
    images: ['https://example.com/classic.jpg'],
    itinerary: [
      { day: 1, title: 'Arrival in Cairo', description: 'VIP airport meet and assist.' },
      { day: 2, title: 'Nile Cruise: Aswan to Luxor Temples', description: 'Sail the Nile in luxury.' },
    ],
    includedServices: ['5-Star Nile Cruise', 'Private Egyptologist'],
    excludedServices: ['International Flights'],
    highlights: ['Pyramids of Giza', 'Nile Cruise Aswan to Luxor'],
  },
  'egypt-jordan-combined-12d': {
    id: 'tour-multi-1',
    slug: 'egypt-jordan-combined-12d',
    title: 'Grand Egypt & Jordan Odyssey',
    overview: 'Combined luxury journey connecting Cairo, Luxor, Petra, and the Dead Sea.',
    destination: 'multi-country',
    country: 'Multi-Country',
    category: 'Multi-Country',
    duration: '12 Days / 11 Nights',
    durationDays: 12,
    basePriceUsd: 2690,
    price: 2690,
    currency: 'USD',
    heroImage: 'https://example.com/multi.jpg',
    images: ['https://example.com/multi.jpg'],
    itinerary: [
      { day: 1, title: 'Cairo Pyramids', description: 'Explore ancient wonders.' },
      { day: 2, title: 'Fly to Amman & Petra', description: 'Cross-border VIP transfer.' },
    ],
    includedServices: ['All Flights & Transfers'],
    excludedServices: ['Visa Fees'],
    highlights: ['Giza & Petra in One Trip'],
  },
};

const ALL_MOCK_TOURS = Object.values(MOCK_TOURS_BY_SLUG);

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="current-pathname">{location.pathname}</div>;
};

describe('Trip Details Client-Side Navigation & Routing Regression Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAllCache();
    window.scrollTo = vi.fn();

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

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.startsWith('/landing-pages/destination/jordan')) {
        return Promise.resolve({
          id: 'lp-jordan',
          slug: 'jordan',
          type: 'DESTINATION',
          title: 'Jordan',
          subtitle: 'Kingdom of Petra',
          description: 'Explore Jordan in luxury.',
          tours: [MOCK_TOURS_BY_SLUG['jordan-petra-wonders-7d']],
          sections: [],
        });
      }
      if (url.startsWith('/tours?')) {
        if (url.includes('destination=multi-country')) {
          return Promise.resolve({
            items: [MOCK_TOURS_BY_SLUG['egypt-jordan-combined-12d']],
            total: 1,
            page: 1,
            limit: 70,
            totalPages: 1,
          });
        }
        return Promise.resolve({
          items: ALL_MOCK_TOURS,
          total: ALL_MOCK_TOURS.length,
          page: 1,
          limit: 70,
          totalPages: 1,
        });
      }
      for (const [slug, tourData] of Object.entries(MOCK_TOURS_BY_SLUG)) {
        if (url.startsWith(`/tours/${slug}`)) {
          return Promise.resolve(tourData);
        }
      }
      return Promise.reject(Object.assign(new Error('Not found'), { status: 404 }));
    });
  });

  it('DurationSortFilter does not re-emit onFilterChange in an infinite loop when parent passes a new array reference with identical tour IDs', () => {
    const onFilterChange = vi.fn();
    const sampleTours = [MOCK_TOURS_BY_SLUG['jordan-petra-wonders-7d'], MOCK_TOURS_BY_SLUG['complete-egypt-8d']];

    const { rerender } = render(
      <DurationSortFilter tours={[...sampleTours]} onFilterChange={onFilterChange} />
    );

    expect(onFilterChange).toHaveBeenCalledTimes(1);

    // Re-render with a brand-new array reference containing the same tours
    rerender(<DurationSortFilter tours={[...sampleTours]} onFilterChange={onFilterChange} />);
    rerender(<DurationSortFilter tours={[...sampleTours]} onFilterChange={onFilterChange} />);

    // Must still only have been called once
    expect(onFilterChange).toHaveBeenCalledTimes(1);
  });

  it('Navigating from a Destination page (/destinations/jordan) by clicking a Trip Card opens TourDetails immediately without manual refresh', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/destinations/jordan']}>
          <LocationDisplay />
          <Routes>
            <Route path="/destinations/:slug" element={<LandingPageDetails destinationOnly />} />
            <Route path="/tours/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // Wait for the destination page and its tour card to appear
    const tourCardHeading = await screen.findByText('Jordan Petra & Wadi Rum Wonders');
    expect(tourCardHeading).toBeInTheDocument();
    expect(screen.getByTestId('current-pathname').textContent).toBe('/destinations/jordan');

    // Click the trip card title link
    fireEvent.click(tourCardHeading);

    // URL changes AND TourDetails renders its itinerary without requiring browser refresh
    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/tours/jordan-petra-wonders-7d');
    });

    expect(await screen.findByText(/Rose City of Petra/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP airport meet and assist/i)).toBeInTheDocument();
  });

  it('Navigating from All Tours page (/tours) by clicking a Trip Card body opens TourDetails immediately', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/tours']}>
          <LocationDisplay />
          <Routes>
            <Route path="/tours" element={<BackendToursPage titleKey="nav.tours" titleDefault="All Tours" />} />
            <Route path="/tours/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const cardTitle = await screen.findByText(/Complete Egypt Classic 8 Days/i);
    expect(cardTitle).toBeInTheDocument();

    // Click the overview text inside the card body (testing handleCardClick via useNavigate)
    const overviewSnippet = screen.getByText(/Explore the Great Pyramids of Giza/i);
    fireEvent.click(overviewSnippet);

    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/tours/complete-egypt-8d');
    });

    expect(await screen.findByText(/Giza Pyramids & Sphinx/i)).toBeInTheDocument();
  });

  it('Navigating from Multi-Country Programs (/programs/multi-country) by clicking Book Now opens TourDetails', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/programs/multi-country']}>
          <LocationDisplay />
          <Routes>
            <Route path="/programs/multi-country" element={<MultiCountryTours />} />
            <Route path="/programs/multi-country/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const cardTitle = await screen.findByText(/Grand Egypt & Jordan Odyssey/i);
    expect(cardTitle).toBeInTheDocument();

    fireEvent.click(cardTitle);

    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/programs/multi-country/egypt-jordan-combined-12d');
    });

    expect(await screen.findByText(/Fly to Amman & Petra/i)).toBeInTheDocument();
  });

  it('Navigating between two different Trip Details pages (/tours/complete-egypt-8d -> /tours/jordan-petra-wonders-7d) updates content without staying stuck on previous tour', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/tours/complete-egypt-8d']}>
          <LocationDisplay />
          <Routes>
            <Route path="/tours/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // 1. First tour renders
    expect(await screen.findByText(/Giza Pyramids & Sphinx/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-pathname').textContent).toBe('/tours/complete-egypt-8d');

    // 2. Click a Suggested Tour card on the same TourDetails page
    const suggestedTourHeading = await screen.findByText(/Jordan Petra & Wadi Rum Wonders/i);
    fireEvent.click(suggestedTourHeading);

    // 3. URL and TourDetails content transition to the new tour
    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/tours/jordan-petra-wonders-7d');
    });

    expect(await screen.findByText(/Rose City of Petra/i)).toBeInTheDocument();
    expect(screen.queryByText(/Giza Pyramids & Sphinx/i)).not.toBeInTheDocument();
  });

  it('Resolves /programs/:category/:programSlug to the requested classic-program tour without silently aliasing it to another tour', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/programs/classic/classic-program']}>
          <Routes>
            <Route path="/programs/:category/:programSlug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // The real classic-program tour must be rendered (not complete-egypt-8d).
    expect(await screen.findByText(/Nile Cruise: Aswan to Luxor Temples/i)).toBeInTheDocument();
    expect(screen.queryByText(/Giza Pyramids & Sphinx/i)).not.toBeInTheDocument();
  });

  it('The Egypt destination "Classic Egypt Programme" card opens the real classic-program tour, not another trip', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/destinations/egypt']}>
          <LocationDisplay />
          <Routes>
            <Route path="/destinations/:slug" element={<Egipto />} />
            <Route path="/tours/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // The card title falls back to the Arabic default under this mocked i18n.
    const classicCard = await screen.findByText('برنامج مصر الكلاسيكي');
    expect(classicCard).toBeInTheDocument();

    fireEvent.click(classicCard);

    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/tours/classic-program');
    });

    // The real classic-program tour renders — never the "Complete Egypt" tour.
    expect(await screen.findByText(/Nile Cruise: Aswan to Luxor Temples/i)).toBeInTheDocument();
    expect(screen.queryByText(/Giza Pyramids & Sphinx/i)).not.toBeInTheDocument();
  });

  it('Clicking an Extension card on /programs/extension opens ExtensionDetails smoothly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/programs/extension']}>
          <LocationDisplay />
          <Routes>
            <Route path="/programs/extension" element={<ExtensionTours />} />
            <Route path="/programs/extension/:id" element={<ExtensionDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const hurghadaCard = await screen.findByText(/Hurghada Red Sea Extension/i);
    fireEvent.click(hurghadaCard);

    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/programs/extension/hurghada-4d3n');
    });

    expect(await screen.findByText(/trip\.hurghada\.day1\.title/i)).toBeInTheDocument();
  });

  it('Clicking a Honeymoon card on /programs/honeymooners opens HoneymoonersDetails smoothly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/programs/honeymooners']}>
          <LocationDisplay />
          <Routes>
            <Route path="/programs/honeymooners" element={<Honeymooners />} />
            <Route path="/programs/honeymooners/:id" element={<HoneymoonersDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const honeymoonCard = await screen.findByText(/Honeymoon in Egypt/i);
    fireEvent.click(honeymoonCard);

    await waitFor(() => {
      expect(screen.getByTestId('current-pathname').textContent).toBe('/programs/honeymooners/honeymoon-egypt');
    });

    expect(await screen.findAllByText(/Honeymoon in Egypt/i)).toBeTruthy();
  });
});
