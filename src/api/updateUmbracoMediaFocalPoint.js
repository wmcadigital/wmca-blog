// Attempt to update an Umbraco media item's focalPoint using a management API.
//
// IMPORTANT: Many Umbraco installations expose a read-only Delivery API to
// client apps. Updating media typically requires a management/content API
// and an API key with write permissions. This module expects the following
// environment variables to be set when updates are required:
// - REACT_APP_UMBRACO_MANAGEMENT_ENDPOINT (optional, default used below)
// - REACT_APP_UMBRACO_MANAGEMENT_API_KEY (required to perform updates)
//
// The exact endpoint path and payload shape may vary between Umbraco
// versions and hosting setups. The implementation below is a reasonable
// starting point and will throw a helpful error if the management API key
// is not configured.

// NOTE: These are kept for reference. The actual request is proxied through
// the server-side API route, so the management key isn't exposed in the client bundle.
// const managementEndpoint = process.env.REACT_APP_UMBRACO_MANAGEMENT_ENDPOINT;
// const managementApiKey = process.env.REACT_APP_UMBRACO_MANAGEMENT_API_KEY;

/**
 * Update the focalPoint for a media item.
 * @param {string} id - media id
 * @param {{left:number,top:number}|{x:number,y:number}} focalPoint - normalized 0..1
 * @returns {Promise<object>} - parsed JSON response from management API
 */
async function updateUmbracoMediaFocalPoint(id, focalPoint) {
  // Proxy through server-side API route so management key isn't exposed in client bundle
  if (!id) throw new Error('Media id required');
  if (!focalPoint) throw new Error('focalPoint object required');

  const r = await fetch(`/api/updateUmbracoMediaFocalPoint?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(focalPoint),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`Failed to update media focalPoint: ${r.status} ${txt}`);
  }
  try {
    return await r.json();
  } catch (e) {
    return {};
  }
}

export default updateUmbracoMediaFocalPoint;
