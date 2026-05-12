// api/vworld-search.js
// VWorld 키워드 검색 API 프록시
// https://api.vworld.kr/req/search (POI 검색)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.query.q || req.query.query || '';
  if (!query) return res.status(400).json({ error: 'query required' });

  const apiKey = process.env.VWORLD_API_KEY || 'E9CD8059-EBAF-3B6E-88CB-B5D0713550B0';
  if (!apiKey) {
    return res.status(200).json({ response: { status: 'ERROR', result: { items: [] } } });
  }

  try {
    const url = `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=epsg:4326&query=${encodeURIComponent(query)}&type=place&category=APT&format=json&errorformat=json&size=5&page=1&key=${apiKey}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ status: 'ERROR', error: e.message, response: { result: { items: [] } } });
  }
}
