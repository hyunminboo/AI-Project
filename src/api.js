const API_BASE_URL = '/api/naver/v1/search/shop.json';

export async function searchShoppingItems(query, display = 20, start = 1, sort = 'sim') {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'your_naver_client_id_here') {
    throw new Error('API keys are missing. Please set VITE_NAVER_CLIENT_ID and VITE_NAVER_CLIENT_SECRET in .env file.');
  }

  const url = `${API_BASE_URL}?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errorMessage || `Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // 만약 네이버 API가 200 OK를 반환했지만 실제 에러 메시지를 담고 있거나 items가 없는 경우
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
