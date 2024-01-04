import PropTypes from "prop-types";

const Breadcrumb = ({ article, current, name, parent, parent2, parent3, parent4, parent5, parent6, parent7, parent8 }) => {
  
  // rename wmca to home for homepage link
  const breadHome = parent[0];
  let breadHomeVal = breadHome.replace("West Midlands Combined Authority", "Home");
  
  // get urlParams from session storage. this is so filter values are kept if breadcrumb link is used
  const searchSessionParams = sessionStorage.getItem("urlParams");
  let searchParams = "";

  if (searchSessionParams == null) {
    searchParams = "";
  } else {
    searchParams = "?" + searchSessionParams;
  }

  return(
  <nav aria-label="Breadcrumbs" className="wmcads-breadcrumb wmcads-container">
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
      {current ? (
      <li className="wmcads-breadcrumb__list-item">
        <a
          href={current + searchParams}
          className={article ? ( "wmcads-breadcrumb__link"   ) : "wmcads-breadcrumb__link wmcads-breadcrumb__link--current"}
          aria-current="page"
        >
          {name}
        </a>
      </li>
      ) : null}
      {article ? (
        <li className="wmcads-breadcrumb__list-item">
          <a
            href={current.url}
            className="wmcads-breadcrumb__link wmcads-breadcrumb__link--current"
            aria-current="page"
          >
            {article}
          </a>
        </li>
      ) : null}
    </ol>
  </nav>
  )
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

Breadcrumb.defaultProps = {
  article: null,
  current: null,
  name: null,
  parent: [],
  parent2: [],
  parent3: [],
  parent4: [],
  parent5: [],
  parent6: [],
  parent7: [],
  parent8: [],
};

export default Breadcrumb;
