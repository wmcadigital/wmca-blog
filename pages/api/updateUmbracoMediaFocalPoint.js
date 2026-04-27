export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Only PATCH supported' });
  const managementEndpoint = process.env.UMBRACO_MANAGEMENT_ENDPOINT || 'https://cms.wmca.org.uk/umbraco/management/api/v1';
  const managementApiKey = process.env.UMBRACO_MANAGEMENT_API_KEY;
  if (!managementApiKey) return res.status(403).json({ error: 'Management API key not configured' });
  const { id } = req.query;
  const focalPoint = req.body;
  if (!id) return res.status(400).json({ error: 'id required' });
  if (!focalPoint) return res.status(400).json({ error: 'focalPoint required' });
  const url = `${managementEndpoint.replace(/\/$/, '')}/media/${encodeURIComponent(id)}`;
  try {
    const r = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': managementApiKey,
      },
      body: JSON.stringify({ focalPoint }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return res.status(r.status).json({ error: txt });
    }
    try {
      const data = await r.json();
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({});
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
