import { ReactNode } from "react";

type UebersichtStepProps = {
  children: ReactNode;
  image: ReactNode;
};

export default function UebersichtStep(
  props: UebersichtStepProps
): JSX.Element {
  const { children, image } = props;
  return (
    <div className="flex-col md:flex-row w-full">
      <div className="flex justify-end lg:absolute lg:right-0 lg:top-80 lg:w-1/3 mb-32 lg:mb-0">
        {image}
      </div>
      <div>{children}</div>
    </div>
  );
}
