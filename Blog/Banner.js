import PropTypes from "prop-types";

const Banner = ({ label, children }) => (
  <div className="wmcads-banner-container">
    <div className="wmcads-banner-container__phase-wrapper">
      <span className="wmcads-phase-indicator">{label}</span>
    </div>
    <p className="wmcads-banner-container__text">{children}</p>
  </div>
);

Banner.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export default Banner;
