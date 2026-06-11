export default async function handler(req, res) {
  const { query, display = 20, start = 1, sort = 'sim' } = req.query;

  const clientId = process.env.VITE_NAVER_CLIENT_ID;
  const clientSecret = process.env.VITE_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server API keys not configured.' });
  }

  if (!query) {
    return res.status(400).json({ error: 'query parameter is required.' });
  }

  const naverUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`;

  try {
    const response = await fetch(naverUrl, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from Naver API', detail: error.message });
  }
}
