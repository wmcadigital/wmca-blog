export default async function handler(req, res) {
  const url = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
  const apiKey = process.env.UMBRACO_API_KEY || process.env.REACT_APP_UMBRACO_API_KEY;
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Api-Key': apiKey } : {}),
      },
    });
    // Attempt to parse JSON; if parsing fails capture text for diagnostics
    let data;
    try {
      data = await r.json();
    } catch (err) {
      const txt = await r.text().catch(() => "");
      const message = `Upstream returned non-JSON response: ${r.status} ${r.statusText} ${txt}`;
      return res.status(502).json({ error: message });
    }

    if (!r.ok) {
      // Forward upstream status and any returned error payload
      const message = data?.error || data?.message || JSON.stringify(data) || `${r.status} ${r.statusText}`;
      return res.status(502).json({ error: `Upstream error: ${message}` });
    }

    return res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
