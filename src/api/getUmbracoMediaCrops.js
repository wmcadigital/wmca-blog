import getUmbracoMedia from './getUmbracoMedia';

/**
 * Fetch a media item's crops from the Umbraco Delivery API.
 * Returns an array (possibly empty) of crop descriptors.
 */
const getUmbracoMediaCrops = async (id) => {
  if (!id) return [];
  const data = await getUmbracoMedia(id);
  return data?.crops || [];
};

export default getUmbracoMediaCrops;
