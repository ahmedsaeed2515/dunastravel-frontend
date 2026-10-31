import { describe, expect, it } from 'vitest';
import { getTourPriceDisplay } from '../components/tour/TourCard';

describe('tour price display scenarios', () => {
  it('keeps a USD price payable and visible in PRICE mode', () => {
    expect(
      getTourPriceDisplay({
        basePriceUsd: '250.00',
        currency: 'USD',
        priceDisplayMode: 'PRICE',
      }),
    ).toEqual({
      displayPrice: 250,
      customPriceLabel: '',
      isCustomPrice: false,
      isPriceHidden: false,
    });
  });

  it('keeps an EUR price payable and visible in PRICE mode', () => {
    expect(
      getTourPriceDisplay({
        basePriceUsd: '180.00',
        currency: 'EUR',
        priceDisplayMode: 'PRICE',
      }),
    ).toMatchObject({
      displayPrice: 180,
      isCustomPrice: false,
      isPriceHidden: false,
    });
  });

  it('hides the price without converting hidden mode into a free tour', () => {
    expect(
      getTourPriceDisplay({
        basePriceUsd: '250.00',
        currency: 'USD',
        priceDisplayMode: 'HIDDEN',
      }),
    ).toMatchObject({
      displayPrice: 250,
      isPriceHidden: true,
      isCustomPrice: false,
    });
  });

  it('represents a genuinely complimentary tour as zero in PRICE mode', () => {
    expect(
      getTourPriceDisplay({
        basePriceUsd: '0.00',
        currency: 'USD',
        priceDisplayMode: 'PRICE',
      }),
    ).toMatchObject({
      displayPrice: 0,
      isPriceHidden: false,
      isCustomPrice: false,
    });
  });
});
