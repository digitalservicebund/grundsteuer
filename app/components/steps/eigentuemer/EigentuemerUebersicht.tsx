import { StepComponentFunction } from "~/routes/formular/_step";
import UebersichtStep from "~/components/form/UebersichtStep";
import eigentuemerUebersicht from "~/assets/images/uebersicht-eigentuemer.svg";
import eigentuemerUebersichtSmall from "~/assets/images/uebersicht-eigentuemer-small.svg";

const EigentuemerUebersicht: StepComponentFunction = () => {
  return (
    <UebersichtStep
      imageSrc={eigentuemerUebersicht}
      smallImageSrc={eigentuemerUebersichtSmall}
    >
      <p className="mb-32">
        In diesem Abschnitt dreht sich alles um Sie: die Eigentümer:in (oder
        Eigentümer:innen).
      </p>

      <p>Wir fragen Sie auf den folgenden Seiten nach diesen Angaben:</p>
      <ul className="mb-32 ml-[15px] list-disc">
        <li>Anzahl der Eigentümer:innen des Grundstücks</li>
        <li>Kontaktdaten der Eigentümer:innen</li>
        <li>Gesetzliche Vertretung</li>
        <li>Eigentumsanteil am Grundstück</li>
        <li>Empfangsbevollmächtigte Person</li>
      </ul>
    </UebersichtStep>
  );
};

export default EigentuemerUebersicht;
