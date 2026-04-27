/**
 * Helper to preload images for better performance
 * Prevents layout shift by declaring dimensions early
 */
export const preloadImage = (src) => {
  if (typeof window === 'undefined') return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Preload multiple images
 */
export const preloadImages = (imageSrcs) => {
  if (typeof window === 'undefined') return;
  
  imageSrcs.forEach(src => {
    if (src) preloadImage(src);
  });
};
