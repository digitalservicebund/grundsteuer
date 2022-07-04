import { ReactNode } from "react";
import classNames from "classnames";

type UebersichtStepProps = {
  children: ReactNode;
  imageSrc: string;
  smallImageSrc: string;
  lowVersion?: boolean;
};

export default function UebersichtStep(
  props: UebersichtStepProps
): JSX.Element {
  const { children, imageSrc, smallImageSrc, lowVersion } = props;
  return (
    <div className="flex-col lg:flex-row w-full mb-80">
      <div
        className={classNames(
          "hidden xl:flex justify-end absolute right-0 top-80 w-1/3 mb-0",
          { "top-[250px]": lowVersion }
        )}
      >
        <img src={imageSrc} alt="" />
      </div>
      <div className="flex mb-56 xl:hidden">
        <img src={smallImageSrc} alt="" />
      </div>
      <div>{children}</div>
    </div>
  );
}
