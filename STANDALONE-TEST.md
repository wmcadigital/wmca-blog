# Standalone App Testing Guide

This document verifies the WMCA Blog app works independently without the web component.

## Prerequisites

- Development server running: `npm run next:dev`
- Server should be on `http://localhost:3001` (or check terminal for actual port)

## Test Scenarios

### 1. ✅ App Loads Without Errors
**Steps:**
1. Open browser console (F12)
2. Navigate to `http://localhost:3000` (or `http://localhost:3001`)
3. Check console for errors

**Expected Result:**
- Page loads successfully
- No red errors in console
- Blog articles list displays

**Verification:**
- ✅ Should see `[BlogArticles] bannerGlobal updated: {}` in console (empty when not in web component)
- ✅ No errors about missing `window.setTopics` or `window.setBanner`

---

### 2. ✅ Blog List Displays Correctly
**Expected Result:**
- Blog article cards are visible
- Article titles, dates, and images display
- No empty states or layout issues

---

### 3. ✅ Filtering Works
**Steps:**
1. Click on a topic/category filter
2. Observe article list updates

**Expected Result:**
- Article list filters by selected topic
- URL updates with topic parameter: `?topics=...`
- Articles matching the topic display

---

### 4. ✅ Search Works
**Steps:**
1. Type in the search box
2. Results update

**Expected Result:**
- Search results display correctly
- Articles are filtered by search term

---

### 5. ✅ Pagination Works
**Steps:**
1. Navigate to page 2 or later using pagination controls
2. Check URL

**Expected Result:**
- Page parameter updates: `?page=2`
- Different articles display
- No web component errors in console

---

### 6. ✅ Article Navigation Works
**Steps:**
1. Click on an article title
2. Navigate to article detail page

**Expected Result:**
- Article page loads with full content
- URL changes to `/article/[title]`
- No console errors
- Related articles display in sidebar

---

### 7. ✅ Browser Back Button Works
**Steps:**
1. From article page, click browser back button

**Expected Result:**
- Returns to article list
- URL changes back to `/`
- No console errors

---

### 8. ✅ Article Breadcrumbs Work (Standalone)
**Steps:**
1. Click breadcrumb link from article page
2. Click "Back to blog" or similar navigation

**Expected Result:**
- Navigation works correctly
- Returns to blog list
- URL updates appropriately

---

## Console Log Verification

When testing standalone (not embedded), you should see:

```javascript
// Expected in console:
[BlogArticles] bannerGlobal updated: {}              // Empty banner when standalone
[wmca-blog] Iframe loaded, topics injected...        // Only when web component embeds it
[wmca-blog] postMessage sent with payload: {...}     // Only when web component embeds it
```

## Expected Differences from Web Component

### When Standalone ❌ Missing:
- Web component initialization messages
- Data injected from web component (banner, topics from attributes)
- postMessage communication

### When Standalone ✅ Still Works:
- Direct URL parameters work (`?topics=...`, `?page=...`)
- Menu filtering works
- Search works
- Pagination works
- Article navigation works
- Back button works

## Success Criteria

✅ **All tests pass when:**
1. No console errors about missing properties
2. All navigation works without refresh
3. Filtering and pagination work via URL parameters
4. Article links work
5. Page renders consistently on reload

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Clear `.next` folder: `rm -rf .next` and rebuild |
| 404 errors | Check Next.js build output, rebuild with `npm run build` |
| Missing articles | Check API endpoints in `pages/api/` |
| Styling issues | Check CSS imports haven't been removed |

---

**Last Updated:** 7 April 2026
**Status:** Ready for testing
