/**
 * IMAGE OPTIMIZATION SUMMARY
 * 
 * Current optimizations implemented:
 * 
 * 1. ✅ next.config.js
 *    - Remote image patterns configured for cms.wmca.org.uk and cloudcdn.wmca.org.uk
 *    - minimumCacheTTL: 365 days (ensures images are cached aggressively)
 *    - formats: ['image/avif', 'image/webp'] (modern formats for smaller file sizes)
 *    - compress: true (reduces response payload)
 * 
 * 2. ✅ Lazy Loading
 *    - All article card images use loading="lazy"
 *    - Sidebar images use loading="lazy"
 *    - Hero images preloaded for immediate display
 * 
 * 3. ✅ Responsive Images
 *    - <picture> elements with srcsets for multiple widths
 *    - WebP format support with fallbacks
 *    - Proper sizes attributes for responsive behavior
 * 
 * 4. ✅ Dimension Declarations
 *    - Width/height props on all images prevent CLS (Cumulative Layout Shift)
 *    - Aspect ratio locked via padding-bottom technique or dimensions
 * 
 * 5. ✅ Hero Image Preloading (NEW)
 *    - Banner images preloaded using link rel="preload"
 *    - Ensures hero image displays quickly without waiting for render
 * 
 * 6. ✅ Custom Umbraco Integration
 *    - buildSrc() and buildSrcSet() helpers transform URLs for optimization
 *    - Focal point handling preserves important image content
 *    - Media crop support for responsive variants
 * 
 * PERFORMANCE IMPACT:
 * - Image caching: 365 days means repeat visitors get instant display
 * - AVIF format: ~20% smaller than WebP for modern browsers
 * - Preloading: Eliminates layout shift on hero images
 * - Lazy loading: Delays off-screen image loading
 * 
 * NEXT OPTIMIZATION OPPORTUNITIES:
 * 1. Image CDN integration (if available from WMCA)
 * 2. Dynamic import of image components (if bundle size increases)
 * 3. Blur-up placeholder while images load (optional, for UX)
 * 4. Responsive image quality based on connection speed (with save-data header)
 */
