// Client wrapper that calls the CMS API directly.
const apiKey = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_UMBRACO_API_URL;

// Simple in-memory cache to avoid duplicate requests during component lifecycle
let cachedBlogArticles = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getBlogArticles = async (bypassCache = false) => {
  // Check if we have a valid cached response
  if (!bypassCache && cachedBlogArticles && cacheTimestamp) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_TTL) {
      return cachedBlogArticles;
    }
  }

  // Build API URL with optimizations:
  // - $select: fetch only essential fields to reduce payload (avoid fetching full content bodies)
  // - $take: limit results to 200 articles max (handles most scenarios)
  // - $orderBy: sort by newest first for better UX
  const url = new URL(apiUrl);
  url.searchParams.append('$select', 'id,name,createDate,updateDate,properties');
  url.searchParams.append('$take', '200');
  url.searchParams.append('$orderBy', 'updateDate desc');

  const r = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Api-Key': apiKey } : {}),
    },
  });
  let data;
  try {
    data = await r.json();
  } catch (e) {
    // If response isn't JSON, capture status text
    const txt = await r.text().catch(() => "");
    throw new Error(`Failed to fetch blog articles: ${r.status} ${r.statusText} ${txt}`);
  }

  if (!r.ok) {
    const msg = data?.error || data?.message || JSON.stringify(data) || `${r.status} ${r.statusText}`;
    throw new Error(`Failed to fetch blog articles: ${msg}`);
  }

  // Cache the response
  cachedBlogArticles = data;
  cacheTimestamp = Date.now();

  return data;
};

export default getBlogArticles;
