export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });
  const base = 'https://cms.wmca.org.uk/umbraco/delivery/api/v2/media/item/';
  const apiKey = process.env.UMBRACO_API_KEY || process.env.REACT_APP_UMBRACO_API_KEY;
  const url = `${base}${encodeURIComponent(id)}`;
  try {
    const r = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(apiKey ? { 'Api-Key': apiKey } : {}) } });
    const data = await r.json();
    res.status(r.ok ? 200 : 502).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
