import getUmbracoMedia from './getUmbracoMedia';

/**
 * Fetch a media item's crops via server-side proxy.
 */
const getUmbracoMediaCrops = async (id) => {
  if (!id) return [];
  const data = await getUmbracoMedia(id);
  return data?.crops || [];
};

export default getUmbracoMediaCrops;
