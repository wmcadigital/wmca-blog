/**
 * Standalone Web Component Build Entry
 * Bundles the blog as a single JavaScript file for embedding
 */

import WmcaBlogComponent from './WebComponent.js';

// Auto-register on load
if (typeof window !== 'undefined') {
  window.WmcaBlogComponent = WmcaBlogComponent;
}

export default WmcaBlogComponent;
