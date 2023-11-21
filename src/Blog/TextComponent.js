import PropTypes from "prop-types";

const TextComponent = ({ htmlContent }) => {
  return (
    <p dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

TextComponent.propTypes = {
  htmlContent: PropTypes.string,
};

export default TextComponent;
