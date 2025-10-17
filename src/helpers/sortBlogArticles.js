const sortBlogArticles = (blogArticles, ascending) => {
  const getDate = (article) =>
    article?.properties?.date ?? article?.Date ?? article?.date ?? null;

  if (ascending == true) {
    return blogArticles.sort((a, b) => (getDate(a) < getDate(b) ? -1 : getDate(a) > getDate(b) ? 1 : 0));
  }

  // default descending
  return blogArticles.sort((a, b) => (getDate(a) > getDate(b) ? -1 : getDate(a) < getDate(b) ? 1 : 0));
};

export default sortBlogArticles;
