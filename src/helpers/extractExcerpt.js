const extractExcerpt = (htmlText) => {
  const firstOpeningParagraphIndex = htmlText.indexOf(">");
  const firstClosingParagraphIndex = htmlText.indexOf("</p>");

  return {
    __html: `${htmlText.slice(
      firstOpeningParagraphIndex + 1,
      firstClosingParagraphIndex
    )}...`,
  };
};

export default extractExcerpt;
