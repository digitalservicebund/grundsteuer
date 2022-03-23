// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ImgsViewer from "react-images-viewer";
import { useState } from "react";
import enlargeIcon from "~/assets/images/enlarge-icon.svg";

type ImageLightboxProps = {
  thumbnail: string;
  image: string;
  altText: string;
};

export const ImageLightbox = ({
  thumbnail,
  image,
  altText,
}: ImageLightboxProps) => {
  const [helpOpen, setHelpOpen] = useState(false);

  const thumbnailComponentMobile = (
    <img src={thumbnail} alt={altText} className="w-full h-auto relative" />
  );

  const thumbnailComponent = (
    <button
      type="button"
      onClick={() => setHelpOpen(true)}
      data-testid="enlarge-button"
    >
      <div className="relative">
        {thumbnailComponentMobile}
        <img
          src={enlargeIcon}
          alt={"Vergrößern"}
          className="pr-32 pb-32 bottom-0 right-0 absolute"
          data-testid="enlarge-icon"
        />
      </div>
    </button>
  );
  return (
    <>
      <div className="hidden md:block">{thumbnailComponent}</div>
      <div className="block md:hidden">{thumbnailComponentMobile}</div>
      <ImgsViewer
        imgs={[{ src: image, caption: altText, alt: altText }]}
        isOpen={helpOpen}
        onClose={() => {
          setHelpOpen(false);
        }}
        backdropCloseable={true}
        showImgCount={false}
        showThumbnails={false}
        theme={{
          footer: {
            "text-align": "center",
          },
        }}
      />
    </>
  );
};
