// let getMediaEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/media/item/";
// let getMediaEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/media/item/";
let getMediaEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/media/item/";

const getUmbracoMedia = async (id) => {
  const response = await fetch(
    getMediaEndPoint + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "54191bfa-d83f-4f8d-80ba-54587374b638",
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