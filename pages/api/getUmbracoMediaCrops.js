export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(200).json([]);
  // Reuse the media endpoint
  const base = 'https://cms.wmca.org.uk/umbraco/delivery/api/v2/media/item/';
  const apiKey = process.env.UMBRACO_API_KEY || process.env.REACT_APP_UMBRACO_API_KEY;
  const url = `${base}${encodeURIComponent(id)}`;
  try {
    const r = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(apiKey ? { 'Api-Key': apiKey } : {}) } });
    if (!r.ok) return res.status(r.status).json([]);
    const data = await r.json();
    res.status(200).json(data?.crops || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
