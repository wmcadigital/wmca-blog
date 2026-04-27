// Use the current location in the browser, otherwise fall back to a safe base
const _base = typeof window !== "undefined" && window.location && window.location.href ? window.location.href : "http://localhost/";
const url = new URL(_base);

// Function for getting the value of a search param in the URL
const getSearchParam = (name) => {
  return url.searchParams.get(name); // Get the search param value for name passed in, and return back
};

// Function for setting the value of a search param in the URL
const setSearchParam = (name, val) => {
  url.searchParams.set(name, val); // Set the search param with the name provided to the value provided
  if (typeof window !== "undefined" && window.history && window.history.pushState) {
    window.history.pushState({}, "", url.href); // Then push the updated search params back to the URL

    // If we ever set new search params then push the new URL to Google Analytics
    window.dataLayer = window.dataLayer || []; // Set datalayer (GA thing)
    // This is a Google Tag Manager event that allows to pass in a route
    window.dataLayer.push({
      event: "ngRouteChange",
      attributes: {
        route: url.search,
      },
    });
  }
};

// Function for deleting a search param in the URL
const delSearchParam = (name) => {
  url.searchParams.delete(name); // Delete the search param for the name provided
  if (typeof window !== "undefined" && window.history && window.history.pushState) {
    window.history.pushState({}, "", url.href); // Then push the updated search params back to the URL
  }
};

export { getSearchParam, setSearchParam, delSearchParam }; // Return functions, so they can be called independently
