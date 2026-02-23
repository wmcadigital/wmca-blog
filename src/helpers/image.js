/**
 * Host root for CMS assets.
 * Keep this constant so all helpers create fully-qualified URLs when needed.
 */
const CMS_HOST = "https://cms.wmca.org.uk";

/**
 * Normalize a provided path or media object into a fully-qualified URL string.
 *
 * Accepts:
 * - A full URL (returns unchanged)
 * - A path starting with `/` (prepends `CMS_HOST`)
 * - A relative path (prepends `CMS_HOST` and a slash)
 * - A media object (common shape from the CMS) with `url`, `src`, `value`,
 *   `path` or `properties.url` fields.
 *
 * Returns an empty string on falsy input.
 */
function normalizePath(path) {
  if (!path) return "";
  // If a media object was passed, extract common url/src fields
  if (typeof path === "object") {
    path =
      path.url || path.src || path.value || path.path || (path.properties && path.properties.url) || "";
  }
  if (!path) return "";
  if (typeof path !== "string") path = String(path);
  // If already an absolute URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Ensure leading slash when combining with CMS host
  return path.startsWith("/") ? `${CMS_HOST}${path}` : `${CMS_HOST}/${path}`;
}

/**
 * Build a single image URL with query parameters for resizing/cropping.
 *
 * - `path` may be a string or media object (normalized via `normalizePath`).
 * - `anchor` defaults to `"0,0"` (no spaces) to avoid generating
 *   unencoded commas/spaces inside `srcset` entries.
 * - All query parameter values are percent-encoded to ensure the resulting
 *   URL can be safely included inside `srcset` and other attributes.
 */
export function buildSrc(path, { width, height, anchor = "0,0", mode = "crop", format } = {}) {
  const base = normalizePath(path);
  if (!base) return "";
  const params = [];
  if (mode) params.push(`mode=${encodeURIComponent(mode)}`);
  if (anchor) params.push(`rxy=${encodeURIComponent(anchor)}`);
  if (width || width === 0) params.push(`width=${encodeURIComponent(width)}`);
  if (height || height === 0) params.push(`height=${encodeURIComponent(height)}`);
  if (format) params.push(`format=${encodeURIComponent(format)}`);
  return `${base}${params.length ? `?${params.join("&")}` : ""}`;
}

/**
 * Create a `srcset` string from a list of widths.
 *
 * If `opts.heightRatio` is provided it will be used to calculate height
 * for each width, otherwise `opts.height` will be used. Each entry is
 * formatted as `<url> <width>w` and entries are joined with `, `.
 */
export function buildSrcSet(path, widths = [320, 480, 768, 1024, 1280], opts = {}) {
  if (!path) return "";
  return widths
    .map((w) => {
      const h = opts.heightRatio && opts.heightRatio > 0 ? Math.round(w * opts.heightRatio) : opts.height;
      const src = buildSrc(path, { width: w, height: h, anchor: opts.anchor, mode: opts.mode, format: opts.format });
      return `${src} ${w}w`;
    })
    .join(", ");
}

/**
 * Helper returning attributes useful for preloading or meta tags.
 *
 * Returns an object with:
 * - `href`: canonical URL for the largest requested width
 * - `imagesrcset`: srcset string for the provided widths
 * - `imagesizes`: sizes string (defaults to a sensible breakpoint)
 * - `blogImg`: alias for `href` retained for backward compatibility
 */
export function buildPreloadAttrs(path, widths = [320, 480, 620], opts = {}) {
  const href = buildSrc(path, { width: Math.max(...widths), height: opts.height });
  const imagesrcset = buildSrcSet(path, widths, opts);
  const imagesizes = opts.imagesizes || "(max-width: 620px) 100vw, 620px";
  // `blogImg` kept for backwards compatibility where callers destructure it
  // as the canonical image URL for meta tags.
  return { href, imagesrcset, imagesizes, blogImg: href };
}

/**
 * Build picture attributes used by <picture> elements
 * Returns srcSet for original, webpSrcSet, fallback src, and imagesizes
 */
/**
 * Build attributes suitable for a `<picture>` element:
 * - `srcSet` for the original image format
 * - `webpSrcSet` for WebP format
 * - `fallback` which is the canonical single-size URL
 * - `imagesizes` for browser sizing hints
 */
export function buildPictureAttrs(path, widths = [320, 480, 768, 1024], opts = {}) {
  if (!path) return { srcSet: "", webpSrcSet: "", fallback: "", imagesizes: opts.imagesizes || "" };
  const srcSet = buildSrcSet(path, widths, opts);
  const webpSrcSet = buildSrcSet(path, widths, Object.assign({}, opts, { format: "webp" }));
  const fallback = buildSrc(path, { width: Math.max(...widths), height: opts.height, anchor: opts.anchor, mode: opts.mode });
  const imagesizes = opts.imagesizes || "(max-width: 600px) 100vw, 600px";
  return { srcSet, webpSrcSet, fallback, imagesizes };
}

export default {
  normalizePath,
  buildSrc,
  buildSrcSet,
  buildPreloadAttrs,
};
