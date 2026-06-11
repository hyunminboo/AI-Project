const API_BASE_URL = '/api/search';

export async function searchShoppingItems(query, display = 20, start = 1, sort = 'sim') {
  const url = `${API_BASE_URL}?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`;

  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errorMessage || errorData.error || `Failed to fetch: ${response.status}`);
  }

  const data = await response.json();

  if (!data.items) {
    throw new Error('데이터 구조가 올바르지 않습니다. API 응답: ' + JSON.stringify(data));
  }

  return data;
}

export async function fetchAllExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch exchange rate');
    const data = await response.json();
    return data.rates; // Return all rates
  } catch (error) {
    console.error("Exchange rate error:", error);
    return null;
  }
}
