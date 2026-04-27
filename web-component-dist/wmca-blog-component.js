(function() {
  if (typeof window === 'undefined') return;
  
  /**
 * Web Component wrapper for WMCA Blog
 * Allows embedding the entire Next.js app as a custom HTML element
 *
 * Usage in Umbraco template:
 * <wmca-blog app-url="https://blog.vercel.app" data-api-key="your-api-key"></wmca-blog>
 * <script src="https://your-cdn.com/wmca-blog-component.js"></script>
 */

class WmcaBlogComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.topics = [];
    this.breadcrumbs = [];
    this.banner = {};
  }

  // Handle attribute changes at runtime
  static get observedAttributes() {
    return ['banner', 'topics', 'breadcrumbs', 'name', 'page'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'banner' && newValue !== oldValue) {
      this.parseBanner(newValue);
      // Re-inject into iframe if it's ready
      if (this.iframeElement) {
        this.injectTopics();
      }
    } else if (name === 'topics' && newValue !== oldValue) {
      this.topics = newValue ? newValue.split(',').map(t => t.trim()).filter(t => t) : [];
      if (this.iframeElement) {
        this.injectTopics();
      }
    } else if (name === 'breadcrumbs' && newValue !== oldValue) {
      this.parseBreadcrumbs(newValue);
      if (this.iframeElement) {
        this.injectTopics();
      }
    } else if (name === 'name' && newValue !== oldValue) {
      this.blogName = newValue || null;
      if (this.iframeElement) {
        this.injectTopics();
      }
    } else if (name === 'page' && newValue !== oldValue) {
      this.parsePageNumber(newValue);
      if (this.iframeElement) {
        this.injectTopics();
      }
    }
  }

  parseBanner(rawBanner) {
    const bannerStr = rawBanner ? String(rawBanner).trim() : '';
    try {
      if (!bannerStr) {
        this.banner = {};
      } else {
        let parsedBanner = null;
        try {
          parsedBanner = JSON.parse(bannerStr);
        } catch (jsonErr) {
          try {
            // Try normalizing single quotes and quoting unquoted keys
            let normalized = bannerStr.replace(/'/g, '"');
            normalized = normalized.replace(/([,{\s])(\w+)\s*:/g, '$1"$2":');
            parsedBanner = JSON.parse(normalized);
          } catch (jsonErr2) {
            // Give up and set empty banner
            console.warn('Could not parse banner attribute as JSON:', jsonErr2.message);
            parsedBanner = {};
          }
        }
        this.banner = parsedBanner || {};
      }
    } catch (e) {
      console.warn('Could not parse banner attribute:', e.message);
      this.banner = {};
    }
  }

  parseBreadcrumbs(rawBreadcrumbs) {
    const breadcrumbsStr = rawBreadcrumbs ? String(rawBreadcrumbs).trim() : '';
    try {
      if (!breadcrumbsStr) {
        this.breadcrumbs = [];
      } else if (breadcrumbsStr.startsWith('[') || breadcrumbsStr.startsWith('"') || breadcrumbsStr.startsWith("'")) {
        try {
          const parsed = JSON.parse(breadcrumbsStr);
          this.breadcrumbs = Array.isArray(parsed) ? parsed : [];
        } catch (jsonErr) {
          try {
            const normalized = breadcrumbsStr.replace(/'/g, '"');
            const parsed2 = JSON.parse(normalized);
            this.breadcrumbs = Array.isArray(parsed2) ? parsed2 : [];
          } catch (jsonErr2) {
            console.warn('Could not parse breadcrumbs as JSON, falling back to comma-split');
            this.breadcrumbs = breadcrumbsStr.split(',').map(b => b.trim()).filter(b => b);
          }
        }
      } else {
        this.breadcrumbs = breadcrumbsStr.split(',').map(b => b.trim()).filter(b => b);
      }
    } catch (e) {
      console.warn('Could not parse breadcrumbs attribute:', e.message);
      this.breadcrumbs = [];
    }
  }

  parsePageNumber(pageAttr) {
    try {
      if (pageAttr !== null && pageAttr !== undefined) {
        const pRaw = String(pageAttr).trim();
        const pNum = Number(pRaw);
        if (!Number.isNaN(pNum) && isFinite(pNum)) {
          this.pageNumber = Math.max(1, Math.floor(pNum));
        }
      }
    } catch (e) {
      this.pageNumber = undefined;
    }
  }

  connectedCallback() {
    // Get attributes
    const appUrl = this.getAttribute('app-url') || process.env.NEXT_PUBLIC_BLOG_URL || 'http://localhost:3000';
    const theme = this.getAttribute('theme') || 'light';
    const height = this.getAttribute('height') || '100vh';
    const topicsAttr = this.getAttribute('topics');
    const nameAttr = this.getAttribute('name');
    const breadcrumbsAttr = this.getAttribute('breadcrumbs');
    const pageAttr = this.getAttribute('page');
    const bannerAttr = this.getAttribute('banner');

    // Parse all attributes
    this.topics = topicsAttr ? topicsAttr.split(',').map(t => t.trim()).filter(t => t) : [];
    this.blogName = nameAttr || null;
    this.parseBreadcrumbs(breadcrumbsAttr);
    this.parsePageNumber(pageAttr);
    this.parseBanner(bannerAttr);

    // Create container
    const container = document.createElement('div');
    container.style.cssText = `
      width: 100%;
      height: ${height};
      border: none;
      display: block;
    `;

    // Create and configure iframe
    const iframe = document.createElement('iframe');
    iframe.src = appUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    `;
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    // Security: Do NOT combine 'allow-scripts' with 'allow-same-origin' - this allows sandbox escape
    iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation');

    container.appendChild(iframe);

    // Shadow DOM styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        --wmca-blog-bg: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
        --wmca-blog-text: ${theme === 'dark' ? '#ffffff' : '#000000'};
      }
    `;

    // Append to shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    // Expose methods for external control
    this.iframeElement = iframe;

    // Make topics available to iframe after load
    this.setupTopicsListener();

    // Listen for navigation messages from the iframe so we can create
    // a parent history entry. This allows the browser back button to
    // return from an article to the list when embedded.
    this._lastPushedUrl = null;
    this._messageHandler = (ev) => {
      try {
        const data = ev && ev.data ? ev.data : null;
        if (!data) return;
        console.debug('[wmca-blog messageHandler] Received message type:', data.type);
        
        // Navigation messages from iframe: create parent history entries
        if (data.type === 'wmca:navigation') {
          const url = data.url || '';
          // Only create a history entry for article pages (avoid flooding history)
          if (url && url.indexOf('/article/') === 0) {
            // Avoid pushing the same URL multiple times
            if (this._lastPushedUrl === url) return;
            try {
              // Use a hash fragment on the parent so we don't change the host path
              // but still create a history entry the browser Back button can hit.
              const slug = url.replace(/^\/article\//, '');
              const hash = `#wmca:article:${encodeURIComponent(slug)}`;
              window.history.pushState({ wmca: 'iframe', url }, '', hash);
              this._lastPushedUrl = url;
              this._lastPushedHash = hash;
            } catch (e) {
              // ignore
            }
          }
          return;
        }

        // Page change messages from iframe - update host page property
        if (data.type === 'wmca:pageChange') {
          try {
            const p = Number(data.page);
            if (!Number.isNaN(p)) {
              this.pageNumber = Math.max(1, Math.floor(p));
              try { this.setAttribute('page', String(this.pageNumber)); } catch (e) { /* ignore */ }
              // Also update the parent window's URL `page` query param so
              // embedding pages reflect the current pagination state.
              try {
                const url = new URL(window.location.href);
                const params = url.searchParams;
                params.set('page', String(this.pageNumber));
                url.search = params.toString();
                const newUrl = url.pathname + (url.search ? `?${url.searchParams.toString()}` : '') + url.hash;
                window.history.replaceState(null, '', newUrl);
              } catch (e) {
                // ignore failures to modify parent URL
              }
            }
          } catch (e) {
            // ignore
          }
          return;
        }

        // Topic change messages from iframe - update host URL with topic parameter
        if (data.type === 'wmca:topicChange') {
          try {
            const topics = Array.isArray(data.topics) ? data.topics : [];
            console.debug('[wmca-blog] Received topicChange message:', topics);
            // Update the parent window's URL `topics` query param so
            // embedding pages reflect the current topic filter state.
            try {
              const url = new URL(window.location.href);
              const params = url.searchParams;
              if (topics.length > 0) {
                params.set('topics', topics.join('/'));
              } else {
                params.delete('topics');
              }
              url.search = params.toString();
              const newUrl = url.pathname + (url.search ? `?${url.searchParams.toString()}` : '') + url.hash;
              console.debug('[wmca-blog] Updated URL to:', newUrl);
              window.history.replaceState(null, '', newUrl);
            } catch (e) {
              console.error('[wmca-blog] Failed to update URL:', e);
              // ignore failures to modify parent URL
            }
          } catch (e) {
            console.error('[wmca-blog] Error processing topicChange:', e);
            // ignore
          }
          return;
        }
        // ignore other message types
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('message', this._messageHandler);
    console.debug('[wmca-blog] Message listener attached');

    // When the parent history changes (back/forward), forward to iframe
    this._popHandler = (ev) => {
      try {
        // If this popstate carries the state we pushed, instruct the iframe
        // to navigate back in its own history. Otherwise fall back to loading root.
        const st = ev && ev.state ? ev.state : null;
        if (st && st.wmca === 'iframe') {
          if (this.iframeElement && this.iframeElement.contentWindow && this.iframeElement.contentWindow.history && typeof this.iframeElement.contentWindow.history.back === 'function') {
            try { this.iframeElement.contentWindow.history.back(); } catch (e) { /* ignore */ }
          }
        } else if (this.iframeElement) {
          const appUrlFallback = this.getAttribute('app-url') || process.env.NEXT_PUBLIC_BLOG_URL || 'http://localhost:3000';
          this.iframeElement.src = appUrlFallback;
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('popstate', this._popHandler);
  }

  // Setup listener for iframe ready state
  setupTopicsListener() {
    // Don't try to inject immediately - iframe page likely not loaded yet
    // Just set up the load event listener
    
    const onIframeLoad = () => {
      // When iframe loads, inject immediately
      this.injectTopics();
      
      // Retry injections with delays to ensure data is available
      // This handles timing issues where React app might not be ready yet
      setTimeout(() => this.injectTopics(), 100);
      setTimeout(() => this.injectTopics(), 300);
      setTimeout(() => this.injectTopics(), 800);
      
      console.debug('[wmca-blog] Iframe loaded, topics injected with retries');
    };
    
    // Listen for load event
    this.iframeElement.addEventListener('load', onIframeLoad, { once: false });
    
    // If iframe is already loaded (shouldn't happen during connectedCallback, but handle it)
    if (this.iframeElement.contentDocument && this.iframeElement.contentDocument.readyState === 'complete') {
      console.debug('[wmca-blog] Iframe already loaded on setup');
      onIframeLoad();
    }
  }

  // Inject topics and breadcrumbs into iframe
  injectTopics() {
    if (!this.iframeElement) {
      console.warn('[wmca-blog] Cannot inject: no iframe element');
      return;
    }

    // Try same-origin injection first
    try {
      const contentWindow = this.iframeElement.contentWindow;
      if (contentWindow) {
        // Initialize setTopics if not exists
        if (!contentWindow.setTopics || typeof contentWindow.setTopics !== 'object') {
          contentWindow.setTopics = {};
        }
        
        // Always set topics (could be empty array)
        contentWindow.setTopics.topics = this.topics;
        
        // Set blog name if provided
        if (this.blogName) {
          contentWindow.setTopics.name = this.blogName;
        }
        
        // Set page if configured
        if (this.pageNumber !== undefined && this.pageNumber !== null) {
          contentWindow.setTopics.page = this.pageNumber;
        }
        
        // Set breadcrumbs if provided
        if (this.breadcrumbs && this.breadcrumbs.length > 0) {
          contentWindow.setTopics.breadcrumbs = {
            breadcrumb: this.breadcrumbs
          };
        }
        
        // Always expose banner (never conditional)
        contentWindow.setBanner = this.banner && typeof this.banner === 'object' ? this.banner : {};
        
        console.debug('[wmca-blog] Same-origin injection succeeded:', {
          topics: this.topics,
          breadcrumbs: this.breadcrumbs,
          banner: this.banner,
          page: this.pageNumber,
          name: this.blogName
        });
      }
    } catch (sameOriginErr) {
      // Cross-origin context - direct property access not available
      console.debug('[wmca-blog] Same-origin injection not available (cross-origin?), using postMessage');
    }

    // Always use postMessage as it works cross-origin
    try {
      if (this.iframeElement && this.iframeElement.contentWindow) {
        const payload = {
          topics: this.topics || [],
          banner: this.banner && typeof this.banner === 'object' ? this.banner : {}
        };
        
        // Add optional fields only if set
        if (this.breadcrumbs && this.breadcrumbs.length > 0) {
          payload.breadcrumbs = { breadcrumb: this.breadcrumbs };
        }
        if (this.blogName) {
          payload.name = this.blogName;
        }
        if (this.pageNumber !== undefined && this.pageNumber !== null) {
          payload.page = this.pageNumber;
        }
        
        this.iframeElement.contentWindow.postMessage(
          { type: 'wmca:setTopics', payload },
          '*'
        );
        
        console.debug('[wmca-blog] postMessage sent with payload:', payload);
      }
    } catch (postMessageErr) {
      console.error('[wmca-blog] postMessage failed:', postMessageErr.message);
    }
  }

  // Method to reload the blog
  reload() {
    if (this.iframeElement) {
      // eslint-disable-next-line no-self-assign
      this.iframeElement.src = this.iframeElement.src;
    }
  }

  // Method to navigate to an article
  navigateToArticle(articleTitle) {
    if (!this.iframeElement) return;
    
    const appUrl = this.getAttribute('app-url') || 'http://localhost:3000';
    const newUrl = `${appUrl}/article/${encodeURIComponent(articleTitle)}`;
    
    console.debug('[wmca-blog] Navigating to article:', newUrl);
    
    // Try to use window.history if same-origin (more reliable than iframe.src)
    try {
      if (this.iframeElement.contentWindow) {
        // For same-origin, use Next.js router if available
        const win = this.iframeElement.contentWindow;
        if (win.history && typeof win.history.pushState === 'function') {
          // Add a small delay to ensure listener is ready
          setTimeout(() => {
            try {
              win.history.pushState(null, '', `/article/${encodeURIComponent(articleTitle)}`);
              // Re-inject data after navigation
              this.injectTopics();
              console.debug('[wmca-blog] Used history.pushState for navigation');
            } catch (e) {
              // Fallback to iframe.src
              console.debug('[wmca-blog] history.pushState failed, falling back to iframe.src');
              this.navigateToArticleViaIframeSrc(newUrl);
            }
          }, 100);
          return;
        }
      }
    } catch (e) {
      console.debug('[wmca-blog] Same-origin navigation not available, using iframe.src');
    }
    
    // Fallback: change iframe src (works cross-origin but may not trigger load event reliably)
    this.navigateToArticleViaIframeSrc(newUrl);
  }

  // Helper method for iframe.src navigation
  navigateToArticleViaIframeSrc(newUrl) {
    let loadEventFired = false;
    
    const onLoadAfterNav = () => {
      if (!loadEventFired) {
        loadEventFired = true;
        this.iframeElement.removeEventListener('load', onLoadAfterNav);
        clearTimeout(timeoutId);
        // Re-inject topics and banner after the new page loads
        this.injectTopics();
        console.debug('[wmca-blog] Article page loaded via iframe.src');
      }
    };
    
    // Set up timeout fallback in case load event doesn't fire
    const timeoutId = setTimeout(() => {
      if (!loadEventFired) {
        loadEventFired = true;
        this.iframeElement.removeEventListener('load', onLoadAfterNav);
        // Re-inject anyway after timeout
        this.injectTopics();
        console.warn('[wmca-blog] Article page load timeout, re-injecting data anyway');
      }
    }, 3000);
    
    this.iframeElement.addEventListener('load', onLoadAfterNav);
    
    // Trigger navigation
    console.debug('[wmca-blog] Setting iframe.src to:', newUrl);
    this.iframeElement.src = newUrl;
  }

  // Method to navigate to an author
  navigateToAuthor(authorName) {
    if (!this.iframeElement) return;
    
    const appUrl = this.getAttribute('app-url') || 'http://localhost:3000';
    const newUrl = `${appUrl}/author/${encodeURIComponent(authorName)}`;
    
    console.debug('[wmca-blog] Navigating to author:', newUrl);
    
    // Try to use window.history if same-origin
    try {
      if (this.iframeElement.contentWindow) {
        const win = this.iframeElement.contentWindow;
        if (win.history && typeof win.history.pushState === 'function') {
          setTimeout(() => {
            try {
              win.history.pushState(null, '', `/author/${encodeURIComponent(authorName)}`);
              // Re-inject data after navigation
              this.injectTopics();
              console.debug('[wmca-blog] Used history.pushState for author navigation');
            } catch (e) {
              console.debug('[wmca-blog] history.pushState failed, falling back to iframe.src');
              this.navigateToAuthorViaIframeSrc(newUrl);
            }
          }, 100);
          return;
        }
      }
    } catch (e) {
      console.debug('[wmca-blog] Same-origin navigation not available, using iframe.src');
    }
    
    this.navigateToAuthorViaIframeSrc(newUrl);
  }

  // Helper method for author iframe.src navigation
  navigateToAuthorViaIframeSrc(newUrl) {
    let loadEventFired = false;
    
    const onLoadAfterNav = () => {
      if (!loadEventFired) {
        loadEventFired = true;
        this.iframeElement.removeEventListener('load', onLoadAfterNav);
        clearTimeout(timeoutId);
        this.injectTopics();
        console.debug('[wmca-blog] Author page loaded via iframe.src');
      }
    };
    
    const timeoutId = setTimeout(() => {
      if (!loadEventFired) {
        loadEventFired = true;
        this.iframeElement.removeEventListener('load', onLoadAfterNav);
        this.injectTopics();
        console.warn('[wmca-blog] Author page load timeout, re-injecting data anyway');
      }
    }, 3000);
    
    this.iframeElement.addEventListener('load', onLoadAfterNav);
    console.debug('[wmca-blog] Setting iframe.src to:', newUrl);
    this.iframeElement.src = newUrl;
  }

  // Method to set topics
  setTopics(topicsArray) {
    if (Array.isArray(topicsArray)) {
      this.topics = topicsArray;
      // Update attribute
      this.setAttribute('topics', topicsArray.join(','));
      // Inject into iframe
      this.injectTopics();
    } else if (typeof topicsArray === 'string') {
      // Handle comma-separated string
      this.topics = topicsArray.split(',').map(t => t.trim()).filter(t => t);
      this.setAttribute('topics', topicsArray);
      this.injectTopics();
    }
  }

  // Method to get topics
  getTopics() {
    return [...this.topics]; // Return copy
  }

  // Method to add a single topic
  addTopic(topic) {
    if (topic && !this.topics.includes(topic)) {
      this.topics.push(topic);
      this.setAttribute('topics', this.topics.join(','));
      this.injectTopics();
    }
  }

  // Method to remove a topic
  removeTopic(topic) {
    const index = this.topics.indexOf(topic);
    if (index > -1) {
      this.topics.splice(index, 1);
      this.setAttribute('topics', this.topics.join(','));
      this.injectTopics();
    }
  }

  // Method to clear all topics
  clearTopics() {
    this.topics = [];
    this.removeAttribute('topics');
  }

  // Method to set breadcrumbs
  setBreadcrumbs(breadcrumbsArray) {
    if (Array.isArray(breadcrumbsArray)) {
      this.breadcrumbs = breadcrumbsArray;
      // Update attribute
      this.setAttribute('breadcrumbs', JSON.stringify(breadcrumbsArray));
      // Inject into iframe
      this.injectTopics();
    }
  }

  // Method to set banner
  setBanner(bannerObj) {
    if (bannerObj && typeof bannerObj === 'object') {
      this.banner = bannerObj;
      try {
        this.setAttribute('banner', JSON.stringify(bannerObj));
      } catch (e) {
        // ignore attribute serialization errors
      }
      // Inject into iframe if present
      try { 
        this.injectTopics(); 
        console.debug('[wmca-blog] Banner updated via setBanner():', bannerObj);
      } catch (err) { 
        console.error('[wmca-blog] Error injecting banner:', err.message);
      }
    } else if (bannerObj === null || bannerObj === undefined) {
      // Clear banner
      this.banner = {};
      try {
        this.removeAttribute('banner');
      } catch (e) {
        // ignore
      }
      try { 
        this.injectTopics(); 
      } catch (err) { 
        console.error('[wmca-blog] Error clearing banner:', err.message);
      }
    }
  }

  // Method to set the current page (1-based)
  setPage(pageNum) {
    if (pageNum === undefined || pageNum === null) return;
    const p = Number(pageNum);
    if (Number.isNaN(p)) return;
    this.pageNumber = Math.max(1, Math.floor(p));
    try {
      this.setAttribute('page', String(this.pageNumber));
    } catch (e) {
      // ignore
    }
    try {
      if (this.iframeElement && this.iframeElement.contentWindow) {
        if (!this.iframeElement.contentWindow.setTopics) this.iframeElement.contentWindow.setTopics = {};
        this.iframeElement.contentWindow.setTopics.page = this.pageNumber;
        // notify via postMessage as well
        this.iframeElement.contentWindow.postMessage({ type: 'wmca:setTopics', payload: { page: this.pageNumber } }, '*');
      }
    } catch (e) {
      // ignore
    }
  }

  // Method to get the configured page (1-based)
  getPage() {
    return this.pageNumber;
  }

  // Method to get banner
  getBanner() {
    return { ...(this.banner || {}) };
  }

  // Method to set the blog name
  setName(name) {
    if (typeof name === 'string') {
      this.blogName = name;
      this.setAttribute('name', name);
      this.injectTopics();
    }
  }

  // Method to get breadcrumbs
  getBreadcrumbs() {
    return [...this.breadcrumbs]; // Return copy
  }

  // Clean up listeners when element removed
  disconnectedCallback() {
    try {
      if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
    } catch (e) {
      /* ignore */
    }
    try {
      if (this._popHandler) window.removeEventListener('popstate', this._popHandler);
    } catch (e) {
      /* ignore */
    }
  }
}

// Register the custom element
if (!customElements.get('wmca-blog')) {
  customElements.define('wmca-blog', WmcaBlogComponent);
}

WmcaBlogComponent;

  
  // Auto-register on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Component is auto-registered via customElements.define
    });
  }
})();