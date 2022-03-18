// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ImgsViewer from "react-images-viewer";
import { useState } from "react";

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
        <img src={thumbnail} alt={altText} className="w-full h-auto" />
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
