// let getMediaEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/media/item/";
// let getMediaEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/media/item/";
const getUmbracoMedia = async (id) => {
  const r = await fetch(`/api/getUmbracoMedia?id=${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error('Failed to fetch media');
  return r.json();
};

export default getUmbracoMedia;