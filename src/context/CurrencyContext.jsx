import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { fetchWithSmartCache, CACHE_POLICIES } from '../utils/apiCache';
const defaultCurrencyContext = {
  currency: 'USD',
  setCurrency: () => {},
  isFallbackRate: false,
  eurRate: 0.888652,
  ecbEurUsdRate: 1.1253,
  ecbUsdEurRate: 0.888652,
  convertPrice: (amount, itemCurrency = 'USD') => {
    const numericAmount = Number(amount);
    return isNaN(numericAmount) ? 0 : numericAmount;
  },
  formatPrice: (amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return '';
    return `$${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  },
};

const CurrencyContext = createContext(defaultCurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const storedCurrency = typeof window !== 'undefined' ? localStorage.getItem('currency') : 'USD';
    return storedCurrency === 'USD' || storedCurrency === 'EUR' ? storedCurrency : 'USD';
  });
  const [eurRate, setEurRate] = useState(0.888652);
  const [ecbEurUsdRate, setEcbEurUsdRate] = useState(1.1253);
  const [ecbUsdEurRate, setEcbUsdEurRate] = useState(0.888652);
  const [isFallbackRate, setIsFallbackRate] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      try {
        const data = await fetchWithSmartCache(
          '/currency/rates',
          () => api.get('/currency/rates'),
          { policy: CACHE_POLICIES.CURRENCY }
        );
        const usdEurVal = Number(data?.meta?.ecbUsdEurRate ?? data?.rates?.EUR ?? data?.EUR);
        const eurUsdVal = Number(data?.meta?.ecbEurUsdRate ?? (usdEurVal > 0 ? 1 / usdEurVal : 1.1253));

        if (usdEurVal > 0 && isMounted) {
          setEurRate(usdEurVal);
          setEcbUsdEurRate(usdEurVal);
          setEcbEurUsdRate(eurUsdVal > 0 ? eurUsdVal : 1.1253);
          setIsFallbackRate(Boolean(data?.meta?.isStale || data?.meta?.status === 'fallback'));
        }
      } catch (err) {
        if (isMounted) {
          setIsFallbackRate(true);
        }
      }
    };
    fetchRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((newCurrency) => {
    if (newCurrency === 'USD' || newCurrency === 'EUR') {
      setCurrencyState(newCurrency);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currency', newCurrency);
      }
    }
  }, []);

  const convertPrice = useCallback((amount, itemCurrency = 'USD') => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 0) return 0;
    const sourceCurrency = String(itemCurrency || 'USD').toUpperCase();
    const targetCurrency = currency.toUpperCase();

    if (sourceCurrency === targetCurrency) {
      return numericAmount;
    }
    if (sourceCurrency === 'EUR' && targetCurrency === 'USD') {
      return numericAmount * ecbEurUsdRate;
    }
    if (sourceCurrency === 'USD' && targetCurrency === 'EUR') {
      return numericAmount * ecbUsdEurRate;
    }
    return numericAmount;
  }, [currency, ecbEurUsdRate, ecbUsdEurRate]);

  const formatPrice = useCallback((amount, itemCurrency = 'USD') => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return '';

    const converted = convertPrice(numericAmount, itemCurrency);
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });

    return currency === 'EUR' ? `€${formatted}` : `$${formatted}`;
  }, [currency, convertPrice]);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      eurRate,
      ecbEurUsdRate,
      ecbUsdEurRate,
      isFallbackRate,
    }),
    [currency, setCurrency, convertPrice, formatPrice, eurRate, ecbEurUsdRate, ecbUsdEurRate, isFallbackRate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => useContext(CurrencyContext) || defaultCurrencyContext;
