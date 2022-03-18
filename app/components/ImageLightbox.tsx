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
  return (
    <>
      <button type="button" onClick={() => setHelpOpen(true)}>
        <div className="relative">
          <img
            src={thumbnail}
            alt={altText}
            className="w-full h-auto relative"
          />
          <img
            src={enlargeIcon}
            alt={"Vergrößern"}
            className="pr-32 pb-32 bottom-0 right-0 absolute"
          />
        </div>

        <ImgsViewer
          imgs={[{ src: image, caption: altText, alt: altText }]}
          isOpen={helpOpen}
          onClose={() => {
            setHelpOpen(false);
          }}
          showImgCount={false}
          showThumbnails={false}
          theme={{
            footer: {
              "text-align": "center",
            },
          }}
        />
      </button>
    </>
  );
};
