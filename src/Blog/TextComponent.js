import PropTypes from "prop-types";

const TextComponent = ({ htmlContent }) => {
  const updatedHtmlContent = htmlContent.replace(
    /<img[^>]+src="([^">]+)"/g,
    (match, p1) => {
      const newSrc = `https://cms.wmca.org.uk/${p1}`;
      return match.replace(p1, newSrc);
    }
  );

  console.log(updatedHtmlContent);
  return <p dangerouslySetInnerHTML={{ __html: updatedHtmlContent }} />;
};

TextComponent.propTypes = {
  htmlContent: PropTypes.string,
};

export default TextComponent;
