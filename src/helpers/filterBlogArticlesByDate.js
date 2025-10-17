const filterBlogArticlesByDate = (
  blogArticles,
  dateFilter,
  dateRangeSet = undefined
) => {
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

  const formatDate = (date) => {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0");
    const day = String(date?.getDate()).padStart(2, "0");
    // const hours = String(date?.getHours()).padStart(2, '0');
    // const minutes = String(date?.getMinutes()).padStart(2, '0');
    // const seconds = String(date?.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const fromDate = formatDate(new Date(dateRangeSet?.from));
  const toDate = formatDate(new Date(dateRangeSet?.to));

  const getArticleDate = (article) => article?.properties?.date ?? article?.Date ?? null;

  if (dateFilter === "updatedLastWeek") {
    return blogArticles.filter((article) => getArticleDate(article) >= dateWeekAgo);
  } else if (dateFilter === "updatedLastMonth") {
    return blogArticles.filter((article) => getArticleDate(article) >= dateMonthAgo);
  } else if (dateFilter === "updatedLastYear") {
    return blogArticles.filter((article) => getArticleDate(article) >= dateYearAgo);
  } else if (dateFilter === "updatedByRange" && dateRangeSet !== undefined) {
    if (fromDate === toDate) {
      return blogArticles.filter((article) => {
        const d = getArticleDate(article);
        if (!d) return false;
        if (d.split("T")[0] === fromDate) {
          return article;
        }
        return false;
      });
    }
    return blogArticles.filter((article) => {
      const d = getArticleDate(article);
      if (!d) return false;
      const datePart = d.split("T")[0];
      return datePart >= fromDate && datePart <= toDate;
    });
  }

  // If none of the above conditions match, return empty array
  return [];
};

export default filterBlogArticlesByDate;
