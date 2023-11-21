import PropTypes from "prop-types";


const ImageComponent = ({ imageUrls }) => {
  return (
    <div className="wmcads-col-1 wmcads-m-b-sm">
      {imageUrls.map((imageUrl, index) => (
        <img key={index} src={`https://app-umbraco-multisite-staging.azurewebsites.net/${imageUrl.url}`} alt={imageUrl.name} className="gallery-image" />
      ))}
    </div>
  );
};


ImageComponent.propTypes = {
  imageUrls: PropTypes.array,
};

export default ImageComponent;
