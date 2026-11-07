import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransportPricingDisplay from '../components/tour/TransportPricingDisplay';

describe('TransportPricingDisplay Component', () => {
  const sampleTour = {
    transportPricing: [
      {
        id: '1',
        route: {
          es: 'Aeropuerto Internacional de El Cairo ↔ Hotel en Guiza o El Cairo',
          en: 'Cairo International Airport ↔ Hotel in Giza or Cairo',
          ar: 'مطار القاهرة الدولي ↔ فندق في الجيزة أو القاهرة',
        },
        priceBase0204: 65,
        priceBase0507: 55,
        priceBase0814: 40,
        currency: 'USD',
        isActive: true,
      },
      {
        id: '2',
        route: {
          es: 'Aeropuerto Internacional de Hurgada ↔ Hotel en Hurgada',
          en: 'Hurghada International Airport ↔ Hotel in Hurghada',
          ar: 'مطار الغردقة الدولي ↔ فندق في الغردقة',
        },
        priceBase0204: 65,
        priceBase0507: 55,
        priceBase0814: 40,
        currency: 'USD',
        isActive: true,
      },
    ],
  };

  const mockT = (key, fallback) => {
    const dict = {
      'transportPricing.title': 'PRECIOS NETOS DE TRASLADOS EXTRAS EN USD Y POR PERSONA:',
      'transportPricing.traslados': 'Traslados',
      'transportPricing.base0204': 'Base 02 – 04',
      'transportPricing.base0507': 'Base 05 – 07',
      'transportPricing.base0814': 'Base 08 – 14',
      'transportPricing.orViceVersa': 'O Viceversa',
    };
    return dict[key] || fallback;
  };

  it('renders the reference header title and columns', () => {
    render(<TransportPricingDisplay tour={sampleTour} t={mockT} lang="es" />);

    expect(screen.getByText('PRECIOS NETOS DE TRASLADOS EXTRAS EN USD Y POR PERSONA:')).toBeInTheDocument();
    expect(screen.getByText('Traslados')).toBeInTheDocument();
    expect(screen.getByText('Base 02 – 04')).toBeInTheDocument();
    expect(screen.getByText('Base 05 – 07')).toBeInTheDocument();
    expect(screen.getByText('Base 08 – 14')).toBeInTheDocument();
  });

  it('appends "... O Viceversa" to route names', () => {
    render(<TransportPricingDisplay tour={sampleTour} t={mockT} lang="es" />);

    expect(
      screen.getByText('Aeropuerto Internacional de El Cairo ↔ Hotel en Guiza o El Cairo ... O Viceversa')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Aeropuerto Internacional de Hurgada ↔ Hotel en Hurgada ... O Viceversa')
    ).toBeInTheDocument();
  });

  it('formats prices as "$ XX" in center cells', () => {
    render(<TransportPricingDisplay tour={sampleTour} t={mockT} lang="es" />);

    const price65 = screen.getAllByText('$ 65');
    const price55 = screen.getAllByText('$ 55');
    const price40 = screen.getAllByText('$ 40');

    expect(price65.length).toBeGreaterThanOrEqual(2);
    expect(price55.length).toBeGreaterThanOrEqual(2);
    expect(price40.length).toBeGreaterThanOrEqual(2);
  });

  it('hides completely if there is no transport pricing data', () => {
    const { container } = render(<TransportPricingDisplay tour={{}} t={mockT} lang="es" />);
    expect(container.firstChild).toBeNull();
  });
});
