import { StepComponentFunction } from "~/routes/formular/_step";
import { UebersichtStep } from "~/components";
import mediumImage from "~/assets/images/uebersicht-abschluss-medium.svg";
import smallImage from "~/assets/images/uebersicht-abschluss-small.svg";

const EigentuemerAbschluss: StepComponentFunction = () => {
  return (
    <UebersichtStep imageSrc={mediumImage} smallImageSrc={smallImage}>
      <div />
    </UebersichtStep>
  );
};

export default EigentuemerAbschluss;
