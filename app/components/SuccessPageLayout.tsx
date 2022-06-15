import { ReactNode } from "react";
import { UebersichtStep } from "~/components";
import imageSrc from "~/assets/images/success-medium.svg";
import smallImageSrc from "~/assets/images/success-small.svg";

export default function SuccessPageLayout(props: { children: ReactNode }) {
  return (
    <UebersichtStep imageSrc={imageSrc} smallImageSrc={smallImageSrc}>
      {props.children}
    </UebersichtStep>
  );
}
