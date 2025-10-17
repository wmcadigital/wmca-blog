import PropTypes from "prop-types";
import { buildPictureAttrs } from "../helpers/image";
import { getPageKey } from "../helpers/page";

const SidebarCardComponent = (data) => {
  const InnerSidebarContent = (data) => {
    return (
      <>
        {data?.image !== null ? (
          (() => {
            const url = data?.image[0].url;
            const widths = [160, 320];
            const { srcSet, webpSrcSet, fallback, imagesizes } = buildPictureAttrs(url, widths, {
              height: 180,
              imagesizes: "(max-width: 320px) 100vw, 320px",
            });
            return (
              <picture>
                <source type="image/webp" srcSet={webpSrcSet} sizes={imagesizes} />
                <source srcSet={srcSet} sizes={imagesizes} />
                <img key={getPageKey()} src={fallback} alt={(data?.image[0].name || "").replace(/\b(image|photo|picture)\b/gi, "").trim() || ""} loading="lazy" decoding="async" width={320} height={180} style={{ objectFit: 'cover' }} />
              </picture>
            );
          })()
        ) : null}
        <div className="wmcads-p-sm">
          <h3>{data.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: data.content.markup }}></div>
        </div>
      </>
    );
  };

  if (data?.link !== null) {
    const url =
      data?.link[0].url !== null
        ? data?.link[0].url
        : `https://cms.wmca.org.uk${data?.link[0].route.path}`;

    return (
      <a href={url} target="_self" className="wmcads-content-card sidebar">
        <InnerSidebarContent {...data} />
      </a>
    );
  } else {
    return (
      <div className="wmcads-content-card sidebar">
        <InnerSidebarContent {...data} />
      </div>
    );
  }
};

SidebarCardComponent.propTypes = {
  data: PropTypes.object,
};

export default SidebarCardComponent;
