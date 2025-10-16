import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import getUmbracoMedia from "../api/getUmbracoMedia";

const ImageComponent = ({ imageUrls }) => {
  const [mediaMap, setMediaMap] = useState({});

  useEffect(() => {
    let mounted = true;
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

    // fetch media data for items that have an id and aren't already cached
    imageUrls.forEach((img) => {
      if (img?.id && !mediaMap[img.id]) {
        getUmbracoMedia(img.id)
          .then((data) => {
            if (!mounted || !data) return;
            setMediaMap((prev) => ({ ...prev, [img.id]: data }));
          })
          .catch(() => {
            // ignore fetch errors; fall back to provided data
          });
      }
    });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrls]);

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return null;

  return (
    <div className="wmcads-image__summary">
      {imageUrls.map((imageUrl, index) => {
        const media = imageUrl?.id ? mediaMap[imageUrl.id] : null;
        const src =
          media?.url ||
          (imageUrl?.url ? `https://cms.wmca.org.uk/${imageUrl.url}` : "");
        const alt =
          media?.properties?.altText || "";

        return (
          <img
            key={imageUrl?.id || imageUrl?.url || index}
            src={src}
            alt={alt}
            className="gallery-image"
          />
        );
      })}
    </div>
  );
};

ImageComponent.propTypes = {
  imageUrls: PropTypes.array,
};

export default ImageComponent;
