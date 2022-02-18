import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepTextField } from "~/components";
import { eigentuemerAnteilField } from "~/domain/fields/eigentuemer/person/anteil";

const Anteil: StepComponentFunction = ({ formData, i18n }) => {
  const [zaehler, nenner] = eigentuemerAnteilField;
  zaehler.label = i18n[zaehler.name];
  nenner.label = i18n[nenner.name];
  return (
    <>
      <StepTextField config={zaehler} value={formData?.[zaehler.name]} />
      <StepTextField config={nenner} value={formData?.[nenner.name]} />
    </>
  );
};

export default Anteil;
