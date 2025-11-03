import PropTypes from "prop-types";

const Link = ({ hrefLink, title, children, target }) => (
  <a
    className="wmcads-link"
    href={hrefLink || "#"}
    title={title}
    {...(target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {children}
  </a>
);

Link.propTypes = {
  hrefLink: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

Link.propTypes.target = PropTypes.string;

export default Link;
