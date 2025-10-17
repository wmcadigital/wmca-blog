const CMS_HOST = "https://cms.wmca.org.uk";

function normalizePath(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Ensure leading slash
  return path.startsWith("/") ? `${CMS_HOST}${path}` : `${CMS_HOST}/${path}`;
}

export function buildSrc(path, { width, height, anchor = "center", mode = "crop", format } = {}) {
  const base = normalizePath(path);
  if (!base) return "";
  const params = [];
  if (anchor) params.push(`anchor=${anchor}`);
  if (mode) params.push(`mode=${mode}`);
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (format) params.push(`format=${format}`);
  return `${base}${params.length ? `?${params.join("&")}` : ""}`;
}

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

export function buildPreloadAttrs(path, widths = [320, 480, 620], opts = {}) {
  const href = buildSrc(path, { width: Math.max(...widths), height: opts.height });
  const imagesrcset = buildSrcSet(path, widths, opts);
  const imagesizes = opts.imagesizes || "(max-width: 620px) 100vw, 620px";
  return { href, imagesrcset, imagesizes };
}

/**
 * Build picture attributes used by <picture> elements
 * Returns srcSet for original, webpSrcSet, fallback src, and imagesizes
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
