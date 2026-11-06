import { useEffect, useState } from 'react';
import { transportPricingApi } from '@/features/transportation/api/transportPricingApi';
import { TransportPricing } from '@/features/transportation/types';
import { useTranslation } from 'react-i18next';

export interface UseTourTransportPricingResult {
  pricings: TransportPricing[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch transport pricing for a specific tour
 * @param tourId - The tour ID to fetch pricing for
 * @param category - Optional category filter (transportation, transfer, private)
 * @returns Transport pricing data and loading state
 */
export function useTourTransportPricing(
  tourId: string,
  category?: string
): UseTourTransportPricingResult {
  const { t } = useTranslation();
  const [pricings, setPricings] = useState<TransportPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) {
      setPricings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    transportPricingApi.list({ category, tourId }).then((result) => {
      const data = Array.isArray(result) ? result : [];
      setPricings(data);
      setIsLoading(false);
    }).catch((err: any) => {
      const msg = err?.response?.data?.message || t('transportation.loadError', 'Failed to load transport pricing');
      setError(msg);
      setIsLoading(false);
      console.error('useTourTransportPricing error:', err);
    });
  }, [tourId, category, t]);

  const refetch = () => {
    transportPricingApi.list({ category, tourId }).then((result) => {
      setPricings(Array.isArray(result) ? result : []);
    }).catch((err: any) => {
      setError(err?.response?.data?.message || t('transportation.loadError', 'Failed to load transport pricing'));
      console.error('useTourTransportPricing refetch error:', err);
    });
  };

  return { pricings, isLoading, error, refetch };
}