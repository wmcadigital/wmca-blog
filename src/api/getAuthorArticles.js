// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&filter=author%3A";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&filter=author%3A";
// let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&filter=author%3A";
const getAuthorArticles = async (id) => {
  const r = await fetch(`/api/getAuthorArticles?id=${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error('Failed to fetch author articles');
  return r.json();
};

export default getAuthorArticles;
