import womanImage from "~/assets/images/woman.svg";
import CopyToClipboard from "./CopyToClipboard";

export default function HomepageSharing() {
  const contentToCopy = "www.grundsteuererklärung-für-privateigentum.de";
  const contentToDisplay = contentToCopy.replace("https://", "");

  return (
    <div>
      <div className="md:hidden mb-36 flex justify-center">
        <CopyToClipboard
          {...{ contentToCopy, contentToDisplay }}
          buttonSize="medium"
        />
      </div>

      <div className="relative">
        <div className="border-b border-gray-900 absolute left-0 right-0 top-[70.5%]" />
        <div className="flex items-center justify-center">
          <img
            src={womanImage}
            alt=""
            role="presentation"
            className="relative w-[154px] md:w-auto"
            width={238}
            height={227}
          />
          <div className="ml-20 pb-64 hidden md:block">
            <CopyToClipboard {...{ contentToCopy, contentToDisplay }} />
          </div>
        </div>
      </div>
    </div>
  );
}
