/**
 * localStorage utilities for persisting blog filter and sort preferences
 */

const STORAGE_KEY = 'wmca-blog-preferences';

/**
 * Get preferences from localStorage
 * @returns {Object} Stored preferences or empty object if none exist
 */
export const getStoredPreferences = () => {
  try {
    if (typeof window === 'undefined') return {};
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
    return {};
  }
};

/**
 * Save preferences to localStorage
 * @param {Object} preferences - Filter and sort preferences to save
 */
export const savePreferences = (preferences) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
};

/**
 * Clear preferences from localStorage
 */
export const clearPreferences = () => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing preferences from localStorage:', error);
  }
};

/**
 * Extract persistable preferences from current filter state
 * @param {Object} filterState - Current filter state object
 * @returns {Object} Preferences to persist
 */
export const extractPreferences = (filterState) => {
  if (!filterState) return {};
  
  return {
    sort: filterState.sort || 'descending',
    topics: Array.isArray(filterState.topics) ? filterState.topics : [],
    author: Array.isArray(filterState.author) ? filterState.author : [],
    dates: filterState.dates || null,
  };
};

/**
 * Restore filter state from preferences
 * @param {Object} storedPreferences - Stored preferences
 * @returns {Object} Filter state with defaults
 */
export const restoreFilterState = (storedPreferences = {}) => {
  return {
    sort: storedPreferences.sort || 'descending',
    topics: storedPreferences.topics || [],
    author: storedPreferences.author || [],
    dates: storedPreferences.dates || null,
    dateRangeSet: storedPreferences.dates ? true : undefined,
  };
};
