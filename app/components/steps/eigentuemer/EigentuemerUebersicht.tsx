import { StepComponentFunction } from "~/routes/formular/_step";
import UebersichtStep from "~/components/form/UebersichtStep";
import eigentuemerUebersicht from "~/assets/images/eigentuemer-uebersicht.svg";

const EigentuemerUebersicht: StepComponentFunction = () => {
  return (
    <UebersichtStep
      image={<img src={eigentuemerUebersicht} alt="Eigentümer:innen" />}
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
