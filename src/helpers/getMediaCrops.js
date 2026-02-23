/**
 * Helper to obtain crop variants for a media item.
 *
 * Accepts either:
 * - a media object (which may already include `crops`), or
 * - a media id (string/number) which will be fetched via the media API.
 *
 * Returns an array (possibly empty) of crop objects.
 */
import getUmbracoMedia from "../api/getUmbracoMedia";
import { getCrops } from "./mediaCrops";

export async function getMediaCrops(mediaOrId) {
  if (!mediaOrId) return [];

  // If a media object is provided and already contains crops, return them.
  if (typeof mediaOrId === "object") {
    if (Array.isArray(mediaOrId.crops) && mediaOrId.crops.length > 0) {
      return getCrops(mediaOrId);
    }

    // Try to extract an ID from common property names then fetch
    const id = mediaOrId.id || mediaOrId.mediaId || mediaOrId.value || null;
    if (!id) return [];

    try {
      const data = await getUmbracoMedia(id);
      return getCrops(data);
    } catch (err) {
      return [];
    }
  }

  // If a primitive id is passed, fetch media
  const id = mediaOrId;
  if (typeof id === "string" && (id.startsWith("http://") || id.startsWith("https://"))) return [];

  try {
    const data = await getUmbracoMedia(id);
    return getCrops(data);
  } catch (err) {
    return [];
  }
}

export default getMediaCrops;
