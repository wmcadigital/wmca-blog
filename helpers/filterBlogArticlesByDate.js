const filterBlogArticlesByDate = (blogArticles, dateFilter) => {
  const currentDate = new Date();

  const dateWeekAgo = new Date(new Date().setDate(currentDate.getDate() - 7))
    .toISOString()
    .substring(0, 19);
  const dateMonthAgo = new Date(new Date().setMonth(currentDate.getMonth() - 1))
    .toISOString()
    .substring(0, 19);
  const dateYearAgo = new Date(
    new Date().setFullYear(currentDate.getFullYear() - 1)
  )
    .toISOString()
    .substring(0, 19);

  if (dateFilter === "updatedLastWeek") {
    return blogArticles.filter((article) => article.properties.date >= dateWeekAgo);
  } else if (dateFilter === "updatedLastMonth") {
    return blogArticles.filter((article) => article.properties.date >= dateMonthAgo);
  } else if (dateFilter === "updatedLastYear") {
    return blogArticles.filter((article) => article.properties.date >= dateYearAgo);
  }
};

export default filterBlogArticlesByDate;
