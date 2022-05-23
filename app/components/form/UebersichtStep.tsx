import { ReactNode } from "react";

type UebersichtStepProps = {
  children: ReactNode;
  imageSrc: string;
  smallImageSrc: string;
};

export default function UebersichtStep(
  props: UebersichtStepProps
): JSX.Element {
  const { children, imageSrc, smallImageSrc } = props;
  return (
    <div className="flex-col lg:flex-row w-full">
      <div className="hidden lg:flex justify-end absolute right-0 top-80 w-1/3 mb-0">
        <img src={imageSrc} alt="" />
      </div>
      <div className="flex mb-56 lg:hidden">
        <img src={smallImageSrc} alt="" />
      </div>
      <div>{children}</div>
    </div>
  );
}
