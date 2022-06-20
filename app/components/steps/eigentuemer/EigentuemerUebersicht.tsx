import { StepComponentFunction } from "~/routes/formular/_step";
import UebersichtStep from "~/components/form/UebersichtStep";
import eigentuemerUebersicht from "~/assets/images/uebersicht-eigentuemer.svg";
import eigentuemerUebersichtSmall from "~/assets/images/uebersicht-eigentuemer-small.svg";
import { ContentContainer } from "~/components";

const EigentuemerUebersicht: StepComponentFunction = () => {
  return (
    <ContentContainer size="sm-md">
      <UebersichtStep
        imageSrc={eigentuemerUebersicht}
        smallImageSrc={eigentuemerUebersichtSmall}
      >
        <p className="mb-32 font-bold">
          In diesem Abschnitt dreht sich alles um Sie als Eigentümer:in des
          Grundstücks.
        </p>

        <p>Wir fragen Sie auf den nächsten Seiten nach:</p>
        <ul className="mb-32 ml-20 list-disc">
          <li>Anzahl der Eigentümer:innen des Grundstücks</li>
          <li>Kontaktdaten der Eigentümer:innen</li>
          <li>Gesetzliche Vertretung</li>
          <li>Eigentumsanteil am Grundstück</li>
          <li>Empfangsbevollmächtigte Person</li>
        </ul>
      </UebersichtStep>
    </ContentContainer>
  );
};

export default EigentuemerUebersicht;
