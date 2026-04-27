export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });
  const base = 'https://cms.wmca.org.uk/umbraco/delivery/api/v2/content/item/';
  const apiKey = process.env.UMBRACO_API_KEY || process.env.REACT_APP_UMBRACO_API_KEY;
  const url = `${base}%2Fauthors%2F${encodeURIComponent(id)}?fields=properties%5B%24all%5D`;
  try {
    const r = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(apiKey ? { 'Api-Key': apiKey } : {}) } });
    if (!r.ok) return res.status(r.status).end();
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
