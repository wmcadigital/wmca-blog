import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { preloadImage } from "../helpers/imagePreload";

const Banner = ({
  image,
  title,
  summary,
  position = "center",
  article = false,
  label,
  children,
}) => {
  const [currentTitle, setCurrentTitle] = useState(title || "Demo blog");

  // Preload banner image for faster display
  useEffect(() => {
    if (image) {
      preloadImage(image);
    }
  }, [image]);

  useEffect(() => {
    // If a title prop is provided, prefer it
    if (title) {
      setCurrentTitle(title);
      return;
    }

    // Otherwise try to read injected name from window.setTopics.
    // Parent may inject after iframe load, so poll briefly to pick it up.
    if (typeof window !== "undefined" && window.setTopics?.name) {
      setCurrentTitle(window.setTopics.name);
      return;
    }

    let stopped = false;
    const start = Date.now();
    const id = setInterval(() => {
      if (stopped) return;
      if (typeof window !== "undefined" && window.setTopics?.name) {
        setCurrentTitle(window.setTopics.name);
        clearInterval(id);
        stopped = true;
      } else if (Date.now() - start > 2000) {
        // stop polling after 2s
        clearInterval(id);
        stopped = true;
      }
    }, 100);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [title]);

  return (
    <>
      {image ? (
        <div className="wmcads-hub-page-banner wmcads-m-b-lg">
          <div className="wmcads-container">
            <div className="wmcads-hub-page-banner__content">
              <div className="wmcads-hub-page-banner__copy wmcads-p-t-md">
                <h1>{currentTitle}</h1>
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
                aria-hidden="true"
                focusable="false"
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
              <h1>{currentTitle}</h1>
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

// Note: defaultProps are deprecated for function components. Defaults are
// provided via destructured parameters above to preserve previous behaviour.

export default Banner;
