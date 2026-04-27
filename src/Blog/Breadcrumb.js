import PropTypes from "prop-types";

const Breadcrumb = ({
  article = null,
  current = null,
  name = null,
  parent = [],
  parent2 = [],
  parent3 = [],
  parent4 = [],
  parent5 = [],
  parent6 = [],
  parent7 = [],
  parent8 = [],
}) => {
  // rename wmca to home for homepage link
  const breadHome = Array.isArray(parent) && parent.length ? parent[0] : "";
  let breadHomeVal = breadHome
    ? breadHome.replace("West Midlands Combined Authority", "Home")
    : "Home";

  // get urlParams from session storage. this is so filter values are kept if breadcrumb link is used
  let searchSessionParams = null;
  try {
    searchSessionParams =
      typeof window !== "undefined" && window.sessionStorage
        ? window.sessionStorage.getItem("urlParams")
        : null;
  } catch (e) {
    // sessionStorage may not be available in sandboxed iframes
    // This is expected when iframe lacks allow-same-origin for security
    console.debug('[Breadcrumb] sessionStorage not available:', e.message);
    searchSessionParams = null;
  }
  let searchParams = searchSessionParams == null ? "" : "?" + searchSessionParams;

  // `current` can be either a string href or an object with a `url` property.
  // Normalize to a string to avoid derefencing null during SSR.
  const currentHref = current
    ? typeof current === "string"
      ? current
      : current.url || ""
    : "";

  return (
    <nav
      aria-label="Breadcrumbs"
      className="wmcads-breadcrumb wmcads-container"
    >
      <ol className="wmcads-breadcrumb__list">
        {/* <li className="wmcads-breadcrumb__list-item">
        <a href="/" className="wmcads-breadcrumb__link">
          Home
        </a>
      </li> */}
        {parent.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent[1]} className="wmcads-breadcrumb__link">
              {breadHomeVal}
            </a>
          </li>
        ) : null}
        {parent2.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent2[1]} className="wmcads-breadcrumb__link">
              {parent2[0]}
            </a>
          </li>
        ) : null}
        {parent3.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent3[1]} className="wmcads-breadcrumb__link">
              {parent3[0]}
            </a>
          </li>
        ) : null}
        {parent4.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent4[1]} className="wmcads-breadcrumb__link">
              {parent4[0]}
            </a>
          </li>
        ) : null}
        {parent5.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent5[1]} className="wmcads-breadcrumb__link">
              {parent5[0]}
            </a>
          </li>
        ) : null}
        {parent6.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent6[1]} className="wmcads-breadcrumb__link">
              {parent6[0]}
            </a>
          </li>
        ) : null}
        {parent7.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent7[1]} className="wmcads-breadcrumb__link">
              {parent7[0]}
            </a>
          </li>
        ) : null}
        {parent8.length != 0 ? (
          <li className="wmcads-breadcrumb__list-item">
            <a href={parent8[1]} className="wmcads-breadcrumb__link">
              {parent8[0]}
            </a>
          </li>
        ) : null}
        {currentHref ? (
          <li className="wmcads-breadcrumb__list-item">
            <a
              href={currentHref + searchParams}
              className={
                article
                  ? "wmcads-breadcrumb__link"
                  : "wmcads-breadcrumb__link wmcads-breadcrumb__link--current"
              }
              aria-current="page"
            >
              {name}
            </a>
          </li>
        ) : null}
        {article ? (
          <li className="wmcads-breadcrumb__list-item">
            <a
              href={currentHref}
              className="wmcads-breadcrumb__link wmcads-breadcrumb__link--current"
              aria-current="page"
            >
              {article}
            </a>
          </li>
        ) : null}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  article: PropTypes.string,
  current: PropTypes.string,
  name: PropTypes.string,
  parent: PropTypes.array,
  parent2: PropTypes.array,
  parent3: PropTypes.array,
  parent4: PropTypes.array,
  parent5: PropTypes.array,
  parent6: PropTypes.array,
  parent7: PropTypes.array,
  parent8: PropTypes.array,
};

// Note: defaultProps on function components is deprecated in future React versions.
// Default parameter values above provide the same defaults and avoid the warning.

export default Breadcrumb;
