import { StepComponentFunction } from "~/routes/formular/_step";
import UebersichtStep from "~/components/form/UebersichtStep";
import grundstueckUebersicht from "~/assets/images/grundstueck-uebersicht.svg";

const GrundstueckUebersicht: StepComponentFunction = () => {
  return (
    <UebersichtStep image={<img src={grundstueckUebersicht} alt="" />}>
      <p className="mb-32">
        In diesem ersten Abschnitt dreht sich alles um das Grundstück, für das
        Sie die Grundsteuererklärung abgeben möchten.
      </p>

      <p>Wir fragen Sie auf den folgenden Seiten nach diesen Angaben:</p>
      <ul className="mb-32 ml-[15px] list-disc">
        <li>Grundstücksadresse</li>
        <li>Steuernummer / Aktenzeichen</li>
        <li>Art des Grundstücks</li>
        <li>Gemeindezugehörigkeit</li>
        <li>Grundbuchblattdaten</li>
        <li>Bodenrichtwert</li>
      </ul>
    </UebersichtStep>
  );
};

export default GrundstueckUebersicht;
