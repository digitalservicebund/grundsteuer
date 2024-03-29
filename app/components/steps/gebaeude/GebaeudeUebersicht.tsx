import { StepComponentFunction } from "~/routes/formular/_step";
import gebaeudeUebersicht from "~/assets/images/uebersicht-gebaeude.svg";
import gebaeudeUebersichtSmall from "~/assets/images/uebersicht-gebaeude-small.svg";
import UebersichtStep from "~/components/form/UebersichtStep";
import { ContentContainer, IntroText } from "~/components";

const GebaeudeUebersicht: StepComponentFunction = () => {
  return (
    <ContentContainer size="sm-md">
      <UebersichtStep
        imageSrc={gebaeudeUebersicht}
        smallImageSrc={gebaeudeUebersichtSmall}
      >
        <IntroText className="mb-32 font-bold">
          In diesem Abschnitt geht es um die Immobilie, die Sie im Abschnitt
          “Grundstück” angegeben haben:
        </IntroText>

        <p>Wir befragen Sie auf den folgenden Seiten zu diesen Themen:</p>
        <ul className="mb-32 ml-20 list-disc">
          <li>Baujahr</li>
          <li>Kernsanierung</li>
          <li>Größe der Wohnfläche</li>
          <li>Weitere Wohnräume</li>
          <li>Garagen</li>
        </ul>
      </UebersichtStep>
    </ContentContainer>
  );
};

export default GebaeudeUebersicht;
