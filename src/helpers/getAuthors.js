const getAuthors = (blogArticles, topics = []) => {
  // If topics are provided, only consider articles that match those topics (case-insensitive)
  const articles = Array.isArray(topics) && topics.length
    ? blogArticles.filter((article) => {
        const articleTags = article.properties.tags || [];
        const lowerTopics = topics.map(t => t.toLowerCase());
        return articleTags.some((tag) => lowerTopics.includes(tag.trim().toLowerCase()));
      })
    : blogArticles;

  const categorySet = new Set();

  articles.forEach((article) => {
    const nullCheck = article.properties.author !== null;
    const emptyArryCheck = article.properties.author?.length !== 0;

    // if author is not null or empty array add to categorySet
    if (nullCheck && emptyArryCheck) {
      const authors = article.properties.author.map((a) => a.name); // get all author name
      authors.forEach((item) => categorySet.add(item)); // add each author to the categorySet
    } else {
      categorySet.add("None");
    }
  });

  const sortedBlogAuthors = Array.from(categorySet).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });

  return sortedBlogAuthors;
};

export default getAuthors;
