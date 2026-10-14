import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripHotelSection from '../components/tour/TripHotelSection';

// Keep the component deterministic: return the provided default string for keys.
const makeT = () => (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key);

const baseProps = {
  tour: {},
  t: makeT(),
  lang: 'en',
  formatPrice: (value) => `$${value}`,
  destinationName: 'Egypt',
};

describe('TripHotelSection rate sheet (6 columns)', () => {
  it('renders all six columns when data exists for each', () => {
    const assignedAccommodations = [
      {
        id: 'acc-1',
        categoryTier: '5_STAR',
        nameJsonb: 'Nile Palace',
        cityJsonb: 'Cairo',
        doubleRoomPriceUsd: 220,
        singleRoomPriceUsd: 160,
        seasonSupplementUsd: 45,
        boatJsonb: 'Nile Cruise Boat',
        boatPriceUsd: 75,
        nights: 3,
        regime: 'BB',
      },
    ];

    render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    // Column headers
    expect(screen.getByText('Hotel Category')).toBeInTheDocument();
    expect(screen.getByText('Hotel & City Names')).toBeInTheDocument();
    expect(screen.getByText('Double Room Rate')).toBeInTheDocument();
    expect(screen.getByText('Single Room Rate')).toBeInTheDocument();
    expect(screen.getByText('Seasonal Fee')).toBeInTheDocument();
    expect(screen.getByText('Boats')).toBeInTheDocument();

    // Row content
    expect(screen.getByText('Nile Palace')).toBeInTheDocument();
    expect(screen.getByText('Cairo')).toBeInTheDocument();
    expect(screen.getByText('5-Star Luxury')).toBeInTheDocument();
    expect(screen.getByText('$220')).toBeInTheDocument();
    expect(screen.getByText('$160')).toBeInTheDocument();
    expect(screen.getByText('+$45')).toBeInTheDocument();
    expect(screen.getByText(/Nile Cruise Boat/)).toBeInTheDocument();
    expect(screen.getByText('+$75')).toBeInTheDocument();
  });

  it('renders the rate-sheet header titles with a defined gold class visible in light and dark mode', () => {
    const assignedAccommodations = [
      {
        id: 'acc-vis',
        categoryTier: '4_STAR',
        nameJsonb: 'Nile Palace',
        cityJsonb: 'Cairo',
        doubleRoomPriceUsd: 220,
        singleRoomPriceUsd: 160,
        seasonSupplementUsd: 45,
        boatJsonb: 'Nile Cruise Boat',
        boatPriceUsd: 75,
      },
    ];

    const { container } = render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    const headerRow = container.querySelector('thead tr');
    expect(headerRow).not.toBeNull();

    // `gold-400` is NOT defined in tailwind.config.js, so any `text-gold-400`
    // is a dead class and the header text inherits an invisible color.
    expect(headerRow.className).not.toMatch(/text-gold-400/);
    // A defined, bright gold (gold-300) keeps the titles legible on the dark header row.
    expect(headerRow.className).toMatch(/text-gold-300/);
  });

  it('hides columns that have no dashboard data', () => {
    const assignedAccommodations = [
      {
        id: 'acc-2',
        nameJsonb: 'Desert Inn',
        cityJsonb: 'Luxor',
        doubleRoomPriceUsd: 100,
      },
    ];

    render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    // Present
    expect(screen.getByText('Hotel & City Names')).toBeInTheDocument();
    expect(screen.getByText('Double Room Rate')).toBeInTheDocument();
    expect(screen.getByText('Desert Inn')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();

    // Absent — never entered in the dashboard, so never rendered
    expect(screen.queryByText('Hotel Category')).not.toBeInTheDocument();
    expect(screen.queryByText('Single Room Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Seasonal Fee')).not.toBeInTheDocument();
    expect(screen.queryByText('Boats')).not.toBeInTheDocument();
  });

  it('falls back to the legacy card grid when no rate-sheet column has data', () => {
    const assignedAccommodations = [
      {
        id: 'acc-3',
        nameJsonb: 'Legacy Partner Hotel',
        cityJsonb: 'Aswan',
        nights: 2,
        regime: 'BB',
      },
    ];

    render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    // Card grid shows the localized hotel name; no rate-sheet column headers render.
    expect(screen.getByText('Legacy Partner Hotel')).toBeInTheDocument();
    expect(screen.queryByText('Double Room Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Seasonal Fee')).not.toBeInTheDocument();
    expect(screen.queryByText('Hotel & City Names')).not.toBeInTheDocument();
  });

  it('never renders a fake "Luxury Partner Hotel" card for seeded placeholder rows', () => {
    const assignedAccommodations = [
      { nights: 3, regime: 'Bed & Breakfast', destination: 'Cairo' },
      { nights: 3, regime: 'Bed & Breakfast', destination: 'Cairo', isDefault: true, sortOrder: 0 },
    ];

    const { container } = render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Luxury Partner Hotel')).not.toBeInTheDocument();
    expect(screen.queryByText('Exclusive Trip Accommodation')).not.toBeInTheDocument();
    // Placeholder-only accommodations hide the whole section.
    expect(container).toBeEmptyDOMElement();
  });

  it('keeps real hotels while ignoring placeholder rows mixed in', () => {
    const assignedAccommodations = [
      { nights: 3, regime: 'Bed & Breakfast', destination: 'Cairo' },
      { id: 'acc-4', nameJsonb: 'Real Hotel', cityJsonb: 'Luxor', nights: 2, regime: 'BB' },
    ];

    render(
      <MemoryRouter>
        <TripHotelSection {...baseProps} assignedAccommodations={assignedAccommodations} />
      </MemoryRouter>
    );

    expect(screen.getByText('Real Hotel')).toBeInTheDocument();
    expect(screen.queryByText('Luxury Partner Hotel')).not.toBeInTheDocument();
  });
});
