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

const managementEndpoint = process.env.REACT_APP_UMBRACO_MANAGEMENT_ENDPOINT || "https://cms.wmca.org.uk/umbraco/management/api/v1";
const managementApiKey = process.env.REACT_APP_UMBRACO_MANAGEMENT_API_KEY;

/**
 * Update the focalPoint for a media item.
 * @param {string} id - media id
 * @param {{left:number,top:number}|{x:number,y:number}} focalPoint - normalized 0..1
 * @returns {Promise<object>} - parsed JSON response from management API
 */
async function updateUmbracoMediaFocalPoint(id, focalPoint) {
  if (!managementApiKey) {
    throw new Error('Missing REACT_APP_UMBRACO_MANAGEMENT_API_KEY environment variable. Cannot update Umbraco media.');
  }

  if (!id) throw new Error('Media id required');
  if (!focalPoint) throw new Error('focalPoint object required');

  // Construct URL. This path may need to be adapted for your Umbraco instance.
  const url = `${managementEndpoint.replace(/\/$/, '')}/media/${id}`;

  const body = { focalPoint };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': managementApiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to update media focalPoint: ${res.status} ${res.statusText} ${txt}`);
  }

  // Return parsed response if available
  try {
    return await res.json();
  } catch (e) {
    return {}; // some APIs return 204 No Content
  }
}

export default updateUmbracoMediaFocalPoint;
