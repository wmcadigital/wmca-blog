/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable standalone build for web component/iframe embedding
  output: 'standalone',
  // Optimize images: enable automatic image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.wmca.org.uk',
      },
      {
        protocol: 'https',
        hostname: 'cloudcdn.wmca.org.uk',
      },
    ],
    // Cache optimized images for 365 days
    minimumCacheTTL: 31536000,
    // Enable AVIF format for modern browsers (better than WebP)
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images (viewports)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for flexible/responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828],
    // Enable SVG support with strict CSP
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable static imports to reduce build time
    disableStaticImages: false,
  },
  // Compress response payloads
  compress: true,
  // Enable source maps in production for debugging and better insights
  productionBrowserSourceMaps: true,
  // Experimental optimizations
  experimental: {
    // Optimize package imports for better code splitting
    optimizePackageImports: ['lodash-es', 'date-fns'],
  },
  // Add cache headers for static assets
  onDemandEntries: {
    // Preemptively compile pages on demand
    maxInactiveAge: 60 * 1000,
  },
  // Configure static file serving with proper cache headers
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
