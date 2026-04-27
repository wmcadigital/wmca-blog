// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content/item/";
const getBlogArticle = async (id) => {
  const r = await fetch(`/api/getBlogArticle?id=${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error('Failed to fetch blog article');
  return r.json();
};

export default getBlogArticle;
