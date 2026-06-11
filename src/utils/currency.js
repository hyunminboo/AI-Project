import { useState, useEffect } from 'react';

const DEFAULT_CURRENCY = { code: 'KRW', symbol: '원', rate: 1 };

export function getGlobalCurrency() {
  try {
    const saved = localStorage.getItem('globalCurrency');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse globalCurrency from localStorage", e);
  }
  return DEFAULT_CURRENCY;
}

export function setGlobalCurrency(currencyObj) {
  localStorage.setItem('globalCurrency', JSON.stringify(currencyObj));
  window.dispatchEvent(new Event('currencyChanged'));
}

export function useGlobalCurrency() {
  const [currency, setCurrency] = useState(getGlobalCurrency());

  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(getGlobalCurrency());
    };
    
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  return currency;
}

export function formatPrice(krwPriceRaw, currencyInfo) {
  const krwPrice = parseInt(krwPriceRaw, 10);
  if (isNaN(krwPrice)) return krwPriceRaw;

  if (currencyInfo.code === 'KRW') {
    return `${krwPrice.toLocaleString()}${currencyInfo.symbol}`;
  }

  // Calculate foreign price
  const foreignPrice = krwPrice / currencyInfo.rate;
  
  let formattedNumber;
  if (currencyInfo.code === 'JPY') {
    // JPY typically doesn't use decimals
    formattedNumber = Math.round(foreignPrice).toLocaleString();
  } else {
    formattedNumber = foreignPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return `${currencyInfo.symbol}${formattedNumber}`;
}

export const CURRENCIES = [
  { code: 'KRW', name: '한국 원', symbol: '원' },
  { code: 'USD', name: '미국 달러', symbol: '$' },
  { code: 'JPY', name: '일본 엔', symbol: '¥' },
  { code: 'EUR', name: '유럽 유로', symbol: '€' },
  { code: 'CNY', name: '중국 위안', symbol: '¥' },
  { code: 'GBP', name: '영국 파운드', symbol: '£' },
  { code: 'AUD', name: '호주 달러', symbol: 'A$' },
];
