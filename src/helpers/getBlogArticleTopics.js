const getBlogArticleTopics = (blogArticles) => {
  // Use a Map to deduplicate topics while preserving the first capitalization variant
  const categoryMap = new Map(); // key: lowercase topic, value: original casing
  
  blogArticles.forEach((article) => {
    const tags = article?.properties?.tags ??
      (article?.ArticleCategory ? [article.ArticleCategory] : undefined);
    if (tags) {
      tags.forEach((tag) => {
        const trimmedTag = tag.trim();
        const lowerTag = trimmedTag.toLowerCase();
        // Only add if we haven't seen this topic before (case-insensitive)
        if (!categoryMap.has(lowerTag)) {
          categoryMap.set(lowerTag, trimmedTag);
        }
      });
    } else {
      if (!categoryMap.has('none')) {
        categoryMap.set('none', 'None');
      }
    }
  });

  // Get unique topics (preserving original casing from first occurrence)
  const sortedBlogTopics = Array.from(categoryMap.values()).sort((a, b) => {
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    return 0;
  });

  return sortedBlogTopics;
};

export default getBlogArticleTopics;
