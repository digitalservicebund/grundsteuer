import { ReactNode } from "react";

type UebersichtStepProps = {
  children: ReactNode;
  image: ReactNode;
  smallImage: ReactNode;
};

export default function UebersichtStep(
  props: UebersichtStepProps
): JSX.Element {
  const { children, image, smallImage } = props;
  return (
    <div className="flex-col lg:flex-row w-full">
      <div className="hidden lg:flex justify-end absolute right-0 top-80 w-1/3 mb-0">
        {image}
      </div>
      <div className="flex mb-32 lg:hidden">{smallImage}</div>
      <div>{children}</div>
    </div>
  );
}
