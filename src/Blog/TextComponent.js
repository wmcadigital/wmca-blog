import PropTypes from "prop-types";

const TextComponent = ({ htmlContent }) => {
  // Update img src
  let updatedHtmlContent = htmlContent.replace(
    /<img[^>]+src="([^">]+)"/g,
    (match, p1) => {
      const newSrc = `https://cms.wmca.org.uk/${p1}`;
      return match.replace(p1, newSrc);
    }
  );
  // Remove all class attributes
  updatedHtmlContent = updatedHtmlContent.replace(/\sclass="[^"]*"/g, "");
  // Remove any <span> tags that wrap headings (e.g., <span><h1>...</h1></span>)
  updatedHtmlContent = updatedHtmlContent.replace(
    /<span[^>]*>\s*(<(h[1-6])[^>]*>.*?<\/\2>)\s*<\/span>/gi,
    "$1"
  );
  // Remove any <span> within headings (e.g., <h2><span>xxx</span></h2>)
  updatedHtmlContent = updatedHtmlContent.replace(
    /<(h[1-6])[^>]*>\s*<span[^>]*>(.*?)<\/span>\s*<\/\1>/gi,
    "<$1>$2</$1>"
  );

  return <div dangerouslySetInnerHTML={{ __html: updatedHtmlContent }} />;
};

TextComponent.propTypes = {
  htmlContent: PropTypes.string,
};

export default TextComponent;
