// api/vworld-geo.js
// VWorld 주소 검색 API 프록시 (EPSG:4326 좌표 반환)
// https://api.vworld.kr/req/address
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.query.q || req.query.query || '';
  if (!query) return res.status(400).json({ error: 'query required' });

  const apiKey = process.env.VWORLD_API_KEY || 'E9CD8059-EBAF-3B6E-88CB-B5D0713550B0';
  if (!apiKey) {
    return res.status(200).json({
      response: { status: 'ERROR', result: null },
      error: 'VWORLD_API_KEY not configured',
    });
  }

  try {
    // 1차: 도로명 주소 검색
    const roadUrl = `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodeURIComponent(query)}&refine=true&simple=false&format=json&type=road&key=${apiKey}`;
    const roadRes = await fetch(roadUrl, { signal: AbortSignal.timeout(8000) });
    const roadData = await roadRes.json();

    if (roadData?.response?.status === 'OK' && roadData.response.result) {
      const r = roadData.response.result;
      return res.status(200).json({
        status: 'OK',
        lng: parseFloat(r.point.x),
        lat: parseFloat(r.point.y),
        roadAddress: r.refined?.text || query,
        zipcode: r.refined?.zipcode || '',
        type: 'road',
      });
    }

    // 2차: 지번 주소 검색 폴백
    const parcelUrl = `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodeURIComponent(query)}&refine=true&simple=false&format=json&type=parcel&key=${apiKey}`;
    const parcelRes = await fetch(parcelUrl, { signal: AbortSignal.timeout(8000) });
    const parcelData = await parcelRes.json();

    if (parcelData?.response?.status === 'OK' && parcelData.response.result) {
      const r = parcelData.response.result;
      return res.status(200).json({
        status: 'OK',
        lng: parseFloat(r.point.x),
        lat: parseFloat(r.point.y),
        roadAddress: r.refined?.text || query,
        zipcode: r.refined?.zipcode || '',
        type: 'parcel',
      });
    }

    res.status(200).json({ status: 'NOT_FOUND', lng: null, lat: null });
  } catch (e) {
    res.status(500).json({ status: 'ERROR', error: e.message });
  }
}
