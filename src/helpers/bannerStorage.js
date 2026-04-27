/**
 * Standalone Banner Configuration Utility
 * 
 * For standalone mode testing (not using web component), use these helpers
 * to set and manage banner configuration in localStorage.
 */

export function setStandaloneBanner(bannerObj) {
  try {
    if (!bannerObj || typeof bannerObj !== 'object') {
      console.error('[WMCA Blog] Banner must be a valid object');
      return false;
    }
    window.localStorage?.setItem('wmca-blog-banner', JSON.stringify(bannerObj));
    // Also set it on window for immediate use
    window.setBanner = bannerObj;
    console.log('[WMCA Blog] Banner configuration saved:', bannerObj);
    // Trigger a refresh so components pick up the new banner
    window.location.reload();
    return true;
  } catch (e) {
    console.error('[WMCA Blog] Error saving banner:', e.message);
    return false;
  }
}

export function getStandaloneBanner() {
  try {
    const storedBanner = window.localStorage?.getItem('wmca-blog-banner');
    if (storedBanner) {
      return JSON.parse(storedBanner);
    }
    return null;
  } catch (e) {
    console.error('[WMCA Blog] Error reading banner from storage:', e.message);
    return null;
  }
}

export function clearStandaloneBanner() {
  try {
    window.localStorage?.removeItem('wmca-blog-banner');
    window.setBanner = {};
    console.log('[WMCA Blog] Banner configuration cleared');
    window.location.reload();
    return true;
  } catch (e) {
    console.error('[WMCA Blog] Error clearing banner:', e.message);
    return false;
  }
}

/**
 * Example banner configuration for testing:
 * 
 * // Set banner in browser console:
 * wmcaBlogSetBanner({
 *   title: "Welcome to the Blog",
 *   description: "Latest news and updates",
 *   image: "https://example.com/banner.jpg",
 *   backgroundColor: "#003d7a",
 *   textColor: "#ffffff"
 * });
 * 
 * // Get current banner:
 * wmcaBlogGetBanner();
 * 
 * // Clear banner:
 * wmcaBlogClearBanner();
 */

// Export as global functions for console access
if (typeof window !== 'undefined') {
  window.wmcaBlogSetBanner = setStandaloneBanner;
  window.wmcaBlogGetBanner = getStandaloneBanner;
  window.wmcaBlogClearBanner = clearStandaloneBanner;
}
