import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import getUmbracoMedia from "../api/getUmbracoMedia";
import { buildSrc, buildSrcSet } from "../helpers/image";
import Head from 'next/head';

const ImageComponent = ({ imageUrls }) => {
  const [mediaMap, setMediaMap] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

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

  const handleImageLoad = (key) => {
    setLoadingImages((prev) => ({ ...prev, [key]: false }));
  };

  const handleImageError = (key) => {
    setLoadingImages((prev) => ({ ...prev, [key]: false }));
  };

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return null;

  return (
    <div className="wmcads-image__summary">
      {imageUrls.map((imageUrl, index) => {
        const media = imageUrl?.id ? mediaMap[imageUrl.id] : null;
        const path = media?.url || imageUrl?.url;
        if (!path) return null;

        // Use intrinsic dimensions from media when available to compute height and aspect ratio
        const intrinsicWidth = media?.properties?.width || imageUrl?.properties?.width;
        const intrinsicHeight = media?.properties?.height || imageUrl?.properties?.height;
        const imgWidth = 600;
        const imgHeight = intrinsicWidth && intrinsicHeight ? Math.round((imgWidth * intrinsicHeight) / intrinsicWidth) : Math.round((imgWidth * 9) / 16);

        const widths = [320, 480, 768, 1024, 1280];
        const srcSet = buildSrcSet(path, widths, { height: imgHeight });
        const webpSrcSet = buildSrcSet(path, widths, { height: imgHeight, format: "webp" });
        const fallbackSrc = buildSrc(path, { width: imgWidth, height: imgHeight });
        const alt = media?.properties?.altText || "";

        const isPriority = !!imageUrl?.priority;
        const imageKey = imageUrl?.id || imageUrl?.url || index;
        const isLoading = loadingImages[imageKey] !== false;

        return (
          <React.Fragment key={imageKey}>
            {isPriority && fallbackSrc && (
              // inject preload for LCP / priority images so the browser can fetch earlier
              <Head>
                <link rel="preload" as="image" href={fallbackSrc} />
              </Head>
            )}
            <div
              style={{
                position: "relative",
                maxWidth: "100%",
                display: "inline-block",
              }}
            >
              <picture>
                <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 600px) 100vw, 600px" />
                <source srcSet={srcSet} sizes="(max-width: 600px) 100vw, 600px" />
                <img
                  src={fallbackSrc}
                  alt={alt}
                  // allow callers to mark an image as priority to opt-out of lazy loading
                  loading={isPriority ? "eager" : "lazy"}
                  decoding="async"
                  width={imgWidth}
                  height={imgHeight}
                  style={{ maxWidth: "100%", height: "auto", display: "block" }}
                  onLoad={() => handleImageLoad(imageKey)}
                  onError={() => handleImageError(imageKey)}
                />
              </picture>
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      border: "3px solid #f3f3f3",
                      borderTop: "3px solid #007dc3",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

ImageComponent.propTypes = {
  imageUrls: PropTypes.array,
};

export default ImageComponent;
