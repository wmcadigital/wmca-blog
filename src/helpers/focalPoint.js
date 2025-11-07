// Helpers for converting Umbraco media focalPoint objects into
// anchor strings used by the CMS image service.
//
// Notes / assumptions:
// - The Delivery API returns a `focalPoint` object which may have
//   properties like { left, top } (normalized 0..1) or { x, y }.
// - The image URL builder in `src/helpers/image.js` will append the
//   returned string as `anchor=<value>` in the query string. Different
//   Umbraco setups accept different anchor formats; this helper produces
//   a conservative `x,y` decimal format (e.g. "0.50,0.50") which is
//   easy to change if your CMS expects a different shape.

export function focalPointToAnchor(focalPoint) {
  if (!focalPoint) return "center";

  // Accept common shapes: { left, top } or { x, y }
  const left = focalPoint.left ?? focalPoint.x ?? focalPoint.horizontal ?? null;
  const top = focalPoint.top ?? focalPoint.y ?? focalPoint.vertical ?? null;

  if (left == null || top == null) return "center";

  const lx = Number(left);
  const ty = Number(top);
  if (Number.isNaN(lx) || Number.isNaN(ty)) return "center";

  // Clamp into 0..1 and format to 2 decimal places
  const cx = Math.max(0, Math.min(1, lx));
  const cy = Math.max(0, Math.min(1, ty));

  return `${cx.toFixed(2)},${cy.toFixed(2)}`;
}

export default { focalPointToAnchor };
