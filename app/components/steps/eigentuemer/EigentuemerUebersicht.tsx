import { StepComponentFunction } from "~/routes/formular/_step";

const EigentuemerUebersicht: StepComponentFunction = () => {
  return (
    <>
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
    </>
  );
};

export default EigentuemerUebersicht;
