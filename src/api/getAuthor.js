// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content/item/";
// Client wrapper that proxies to server-side API route
const getAuthor = async (id) => {
  const r = await fetch(`/api/getAuthor?id=${encodeURIComponent(id)}`);
  if (!r.ok) return 'Not found';
  return r.json();
};

export default getAuthor;
