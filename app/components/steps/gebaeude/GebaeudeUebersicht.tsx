import { StepComponentFunction } from "~/routes/formular/_step";
import gebaeudeUebersicht from "~/assets/images/uebersicht-gebaeude.svg";
import gebaeudeUebersichtSmall from "~/assets/images/uebersicht-gebaeude-small.svg";
import UebersichtStep from "~/components/form/UebersichtStep";

const GebaeudeUebersicht: StepComponentFunction = () => {
  return (
    <UebersichtStep
      image={<img src={gebaeudeUebersicht} alt="" />}
      smallImage={<img src={gebaeudeUebersichtSmall} alt="" />}
    >
      <p className="mb-32">
        In diesem Abschnitt geht es um die Immobilie, die Sie im Abschnitt
        “Grundstück” angegeben haben:
      </p>

      <p>Wir befragen Sie auf den folgenden Seiten zu diesen Themen:</p>
      <ul className="mb-32 ml-[15px] list-disc">
        <li>Baujahr</li>
        <li>Kernsanierung</li>
        <li>Größe der Wohnfläche</li>
        <li>Weitere Wohnräume</li>
        <li>Garagen</li>
      </ul>
    </UebersichtStep>
  );
};

export default GebaeudeUebersicht;
