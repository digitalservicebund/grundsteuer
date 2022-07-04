import { ReactNode } from "react";
import { UebersichtStep } from "~/components";
import imageSrc from "~/assets/images/success-medium.svg";
import smallImageSrc from "~/assets/images/success-small.svg";

export default function SuccessPageLayout(props: {
  lowVersion?: boolean;
  children: ReactNode;
}) {
  return (
    <UebersichtStep
      imageSrc={imageSrc}
      smallImageSrc={smallImageSrc}
      lowVersion={props.lowVersion}
    >
      {props.children}
    </UebersichtStep>
  );
}
