const filterBlogArticlesByDate = (blogArticles, dateFilter, dateRangeSet = undefined) => {

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
    const month = String(date?.getMonth() + 1).padStart(2, '0');
    const day = String(date?.getDate()).padStart(2, '0');
    const hours = String(date?.getHours()).padStart(2, '0');
    const minutes = String(date?.getMinutes()).padStart(2, '0');
    const seconds = String(date?.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } 
  
  const fromDate = formatDate(new Date(dateRangeSet?.from))
  const toDate = formatDate(new Date(dateRangeSet?.to))

  if (dateFilter === "updatedLastWeek") {
    return blogArticles.filter((article) => article.properties.date >= dateWeekAgo);
  } else if (dateFilter === "updatedLastMonth") {
    return blogArticles.filter((article) => article.properties.date >= dateMonthAgo);
  } else if (dateFilter === "updatedLastYear") {
    return blogArticles.filter((article) => article.properties.date >= dateYearAgo);
  } else if (dateFilter === "updatedByRange" && dateRangeSet !== undefined) {
    return blogArticles.filter((article) => article.properties.date >= fromDate && article.properties.date <= toDate);
  }
};

export default filterBlogArticlesByDate;
