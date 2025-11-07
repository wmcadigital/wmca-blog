/**
 * Helpers to read and select crop variants from Umbraco media JSON.
 *
 * Media items returned by the Delivery API often include a `crops` array
 * with objects describing named crops (alias, url, width, height, etc.).
 * These helpers provide safe access and a small selection strategy.
 */

export function getCrops(media) {
  if (!media) return [];
  return Array.isArray(media.crops) ? media.crops : [];
}

export function findCropByAlias(media, alias) {
  if (!alias) return null;
  const crops = getCrops(media);
  return crops.find((c) => (c.alias || c.name) === alias) || null;
}

/**
 * Find the best crop matching a target width/height.
 * Strategy:
 *  - If alias provided, return that crop.
 *  - Otherwise, compute target ratio and prefer crops with closest aspect ratio.
 *  - Prefer crops with width >= targetWidth when possible.
 */
export function findBestCrop(media, { alias = null, targetWidth = null, targetHeight = null } = {}) {
  const crops = getCrops(media);
  if (!crops.length) return null;
  if (alias) return findCropByAlias(media, alias);

  // If we don't have target dims, return the largest crop by area
  if (!targetWidth || !targetHeight) {
    return crops.slice().sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0))[0] || null;
  }

  const targetRatio = targetWidth / targetHeight;

  // Score crops by (ratioDiff * 100) + penalty if width < targetWidth
  function scoreCrop(c) {
    const w = c.width || 0;
    const h = c.height || 1; // avoid division by zero
    const ratio = w / h;
    const ratioDiff = Math.abs(ratio - targetRatio);
    const widthPenalty = w < targetWidth ? 1 : 0; // prefer crops >= requested width
    return ratioDiff + widthPenalty * 10; // weight penalty higher
  }

  let best = null;
  let bestScore = Infinity;
  for (const c of crops) {
    const s = scoreCrop(c);
    if (s < bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best;
}

export default { getCrops, findCropByAlias, findBestCrop };
