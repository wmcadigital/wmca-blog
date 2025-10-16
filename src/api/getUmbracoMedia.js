// let getMediaEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/media/item/";
// let getMediaEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/media/item/";
let getMediaEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/media/item/";

const apiKey = process.env.REACT_APP_UMBRACO_API_KEY;

const getUmbracoMedia = async (id) => {
  const response = await fetch(
    getMediaEndPoint + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
    }
  );
  if (!response.ok) {
    console.log(response.status, response.statusText);
  } else {
    const data = await response.json();
    return data;
  }
};

export default getUmbracoMedia;