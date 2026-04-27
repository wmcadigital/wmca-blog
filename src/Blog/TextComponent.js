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
    // ensure width/height are present to avoid layout shifts (fallback to 620x300)
    let updated = match.replace(p1, newSrc).replace(/<img/, '<img loading="lazy" decoding="async"');
    if (!/\bwidth=/.test(updated) && !/\bwidth="/.test(updated)) {
      updated = updated.replace(/<img/, '<img width="620"');
    }
    if (!/\bheight=/.test(updated) && !/\bheight="/.test(updated)) {
      updated = updated.replace(/<img/, '<img height="300"');
    }
    // ensure responsive sizing
    if (!/style=/.test(updated)) {
      updated = updated.replace(/<img([^>]*)>/, '<img$1 style="max-width:100%;height:auto">');
    }
    return updated;
  });
  // Remove margin-left: auto from image styles
  updatedHtmlContent = updatedHtmlContent.replace(
    /<img([^>]*?)style="([^"]*margin-left\s*:\s*auto[^"]*)"/gi,
    (match, beforeStyle, styleContent) => {
      // Remove margin-left: auto from the style attribute
      const cleanedStyle = styleContent.replace(/margin-left\s*:\s*auto\s*;?\s*/gi, "").trim();
      if (cleanedStyle) {
        return `<img${beforeStyle}style="${cleanedStyle}"`;
      }
      return `<img${beforeStyle}`;
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

  // Remove empty paragraphs or paragraphs that only contain non-breaking spaces
  // e.g. <p>&nbsp;</p> or <p> </p>
  updatedHtmlContent = updatedHtmlContent.replace(/<p[^>]*>(?:\s|&nbsp;|&#160;)*<\/p>/gi, "");

  // Replace any non-breaking space entities with a normal space so they
  // don't persist in the rendered text (e.g. &nbsp; or &#160;)
  updatedHtmlContent = updatedHtmlContent.replace(/&nbsp;|&#160;/gi, " ");

  // Remove any remaining <span> tags but keep their inner content.
  // This strips styling spans the CMS sometimes injects while preserving text.
  updatedHtmlContent = updatedHtmlContent.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");

  return <div dangerouslySetInnerHTML={{ __html: updatedHtmlContent }} />;
};

TextComponent.propTypes = {
  htmlContent: PropTypes.string,
};

export default TextComponent;
