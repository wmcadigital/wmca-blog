import PropTypes from "prop-types";

const Banner = ({ image, title, summary, position, article, label, children }) => {
  return (
    <>
      {image ? (
        <div className="wmcads-hub-page-banner wmcads-m-b-lg">
          <div className="wmcads-container">
            <div className="wmcads-hub-page-banner__content">
              <div className="wmcads-hub-page-banner__copy wmcads-p-t-md">
                <h1>{title}</h1>
                {summary ? <p>{summary}</p> : null}
              </div>
            </div>
          </div>
          <div
            className="wmcads-hub-page-banner__image wmcads-hide-mobile"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: `${position}`,
            }}
          >
            <svg
              className="wmcads-hub-page-banner__svg-background"
              viewBox="0 0 40 200"
            >
              <path d="M0,0v200h6.03l32.87-93.5c1.48-4.21,1.48-8.79,0-12.99L6.03,0H0z"></path>
            </svg>
          </div>
        </div>
      ) : (
        <>
          {article ? (
            <></>
          ) : (
            <div className="wmcads-container">
              <h1>{title}</h1>
            </div>
          )}
        </>
      )}
      {/* children and optional label for tests */}
      <div className="wmcads-banner-container__text">{children}</div>
      {label ? <div className="wmcads-phase-indicator">{label}</div> : null}
    </>
  );
};

Banner.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  summary: PropTypes.string,
  position: PropTypes.string,
  article: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.node,
};

Banner.defaultProps = {
  title: window?.setTopics?.name,
  position: "center",
  article: false,
};

export default Banner;
