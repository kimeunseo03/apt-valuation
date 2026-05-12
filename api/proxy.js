// api/proxy.js
// 공공데이터 포털 API CORS 프록시
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });

  // 허용 도메인만 프록시
  const allowed = [
    'apis.data.go.kr',
    'api.data.go.kr',
    'openapi.gg.go.kr',
  ];
  let target;
  try { target = new URL(url); } catch { return res.status(400).json({ error: 'invalid url' }); }
  if (!allowed.some(d => target.hostname.endsWith(d))) {
    return res.status(403).json({ error: 'domain not allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/xml, application/json, text/xml, */*' },
      signal: AbortSignal.timeout(10000),
    });
    const contentType = response.headers.get('content-type') || 'text/xml';
    const text = await response.text();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
