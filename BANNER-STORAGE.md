# Standalone Banner Configuration Guide

When running the WMCA Blog app independently (not embedded in a web component), you can configure the banner using browser storage utilities.

## Overview

The app supports banner configuration through multiple sources, in priority order:

1. **Web Component Injection** - `window.setBanner` (highest priority)
2. **Web Component PostMessage** - `window.setTopics.banner`
3. **Local Storage** - `localStorage['wmca-blog-banner']` (standalone fallback)

## For Standalone Mode

### Setting Banner Configuration

Open your browser console (F12) and use the global function:

```javascript
wmcaBlogSetBanner({
  title: "Welcome to the Blog",
  description: "Latest news and updates",
  image: "https://example.com/banner.jpg",
  backgroundColor: "#003d7a",
  textColor: "#ffffff"
});
```

**What it does:**
- Saves the banner object to `localStorage`
- Sets `window.setBanner` immediately
- Reloads the page so components pick up the new banner

### Getting Current Banner Configuration

```javascript
wmcaBlogGetBanner();
// Returns: { title: "...", description: "...", ... } or null
```

### Clearing Banner Configuration

```javascript
wmcaBlogClearBanner();
// Removes banner from storage and reloads page
```

## Example Configurations

### Professional Blog Banner
```javascript
wmcaBlogSetBanner({
  title: "WMCA Blog",
  subtitle: "West Midlands Combined Authority",
  description: "News, updates, and insights from WMCA",
  image: "https://cdn.example.com/wmca-banner.jpg",
  backgroundColor: "#003d7a",
  textColor: "#ffffff",
  ctaText: "Read More",
  ctaUrl: "/about"
});
```

### Simple Banner
```javascript
wmcaBlogSetBanner({
  title: "Blog Updates",
  description: "Latest articles and news"
});
```

### Minimal Banner
```javascript
wmcaBlogSetBanner({
  title: "Welcome"
});
```

## How It Works

### Initialization Flow (Standalone Mode)

```
Page Load
   ↓
_app.js initializes
   ↓
BlogArticles component mounts
   ↓
useEffect checks for banner sources:
   ├─ window.setBanner? → Use it
   ├─ window.setTopics.banner? → Use it
   ├─ localStorage['wmca-blog-banner']? → Use it ✅
   └─ Nothing found? → Empty banner {}
   ↓
Component renders with banner data
```

### Persistence

When using a web component:
- Banner is passed via `app-url` attribute or `setBanner()` method
- Automatically saved to `localStorage` by `pages/_app.js`
- Persists across page reloads in standalone mode

When running standalone:
- Set via `wmcaBlogSetBanner()` in console
- Saved to `localStorage` for persistence
- Reloaded on page refresh

## Testing Standalone Mode

### Quick Test

1. Open the app: `http://localhost:3001`
2. Open browser console (F12)
3. Run:
   ```javascript
   wmcaBlogSetBanner({ title: "Test Banner", description: "Testing" });
   ```
4. Page reloads and banner appears
5. Refresh page (F5) - banner still there (from localStorage)

### Full Test Scenario

```javascript
// 1. Set initial banner
wmcaBlogSetBanner({
  title: "Publication Hub",
  description: "WMCA publications and resources"
});

// 2. Verify it's stored (should show the banner object)
wmcaBlogGetBanner();

// 3. Navigate around
// - Click articles
// - Use filters
// - Check banner persists

// 4. Clear and reload
wmcaBlogClearBanner();
// Page reloads with no banner
```

## Implementation Details

### File Locations

- **Helper:** `/src/helpers/bannerStorage.js` - Storage utilities
- **App Integration:** `/pages/_app.js` - Imports and initializes utilities
- **Component Usage:** `/src/Blog/BlogArticles.js` - Reads banner from storage
- **PostMessage Save:** `/pages/_app.js` - Automatically saves banner to storage

### Storage Key

- **Key:** `wmca-blog-banner`
- **Type:** `localStorage`
- **Format:** JSON string of banner object

### Global Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `wmcaBlogSetBanner(obj)` | Set banner and reload | `boolean` |
| `wmcaBlogGetBanner()` | Get current banner from storage | `object \| null` |
| `wmcaBlogClearBanner()` | Clear banner and reload | `boolean` |

## Fallback Behavior

### Web Component Mode
```
window.setBanner (set by component)
  ↓ also saved to localStorage by _app.js
  ↓
localStorage['wmca-blog-banner']
```

### Standalone Mode
```
localStorage['wmca-blog-banner']
  ↓ loaded by BlogArticles useEffect
  ↓
bannerGlobal state
```

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (with localStorage enabled)
- ⚠️ Private/Incognito Mode: localStorage persists only in current session

## Troubleshooting

### Banner Not Showing After `wmcaBlogSetBanner()`

```javascript
// Check if it was saved:
wmcaBlogGetBanner()

// Check localStorage directly:
localStorage.getItem('wmca-blog-banner')

// Try clearing and resetting:
wmcaBlogClearBanner();
wmcaBlogSetBanner({ title: "Test" });
```

### Banner Shows But Incorrect Data

```javascript
// Verify the object:
wmcaBlogGetBanner()

// Update with correct data:
wmcaBlogSetBanner({
  title: "Correct Title",
  description: "Correct Description"
});
```

### localStorage Errors

```javascript
// Check if localStorage is available:
typeof window !== 'undefined' && window.localStorage

// In Private/Incognito mode, storage may be restricted
// Use in-memory storage instead (set without reload):
window.setBanner = { title: "Test" };
window.dispatchEvent(new CustomEvent('wmca:setTopics', { 
  detail: { banner: { title: "Test" } } 
}));
```

## Related Documentation

- See [STANDALONE-TEST.md](./STANDALONE-TEST.md) for full testing guide
- See [STANDALONE-VERIFICATION.md](./STANDALONE-VERIFICATION.md) for architecture details
- See [WebComponent.js](./src/WebComponent.js) for web component implementation

---

**Created:** 7 April 2026  
**Status:** Ready for use in standalone and web component modes
