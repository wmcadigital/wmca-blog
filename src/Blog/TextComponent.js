import PropTypes from "prop-types";

const TextComponent = ({ htmlContent }) => {
  // Update img src
  let updatedHtmlContent = htmlContent.replace(/<img[^>]+src="([^"]+)"/g, (match, p1) => {
    // Convert relative CMS src paths to absolute, and add loading/decoding attributes.
    // If the src already contains width/format params, leave them alone.
    const path = p1.startsWith("http") ? p1 : `/${p1}`;
    const hasParams = path.includes("?");
    const newSrc = path.startsWith("https://cms.wmca.org.uk") ? path : `https://cms.wmca.org.uk${path}${hasParams ? "" : "?width=600"}`;
    // inject loading and decoding attributes into the img tag
    const updated = match.replace(p1, newSrc).replace(/<img/, '<img loading="lazy" decoding="async"');
    return updated;
  });
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
