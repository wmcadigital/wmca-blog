const filterBlogArticlesByArea = (blogArticles, areasFilter) =>
  blogArticles.filter((article) => {
    const matchingAreas = (article.ArticleArea ?? []).filter((area) => {
      if (areasFilter.includes(area)) {
        return true;
      }
      return false;
    });
    if (matchingAreas.length > 0) {
      return true;
    } else {
      return false;
    }
  });

export default filterBlogArticlesByArea;
