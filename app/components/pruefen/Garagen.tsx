import { StepComponentFunction } from "~/routes/pruefen/_step";
import IntroText from "../IntroText";
import { ContentContainer, StepFormFields } from "~/components";

const Garagen: StepComponentFunction = (inputData) => {
  if (inputData.testFeaturesEnabled) {
    return (
      <div>
        <IntroText className="mb-32">
          Mithilfe dieser konkreten Beispiele wollen wir verstehen, ob Sie
          Miteigentumsanteile haben. In den meisten Fällen hat man keine
          Miteigentumsanteile. Mehr dazu:{" "}
          <a
            className="underline text-blue-800"
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/20-miteigentum"
            target="_blank"
          >
            Fragen zu den Miteigentumsanteilen
          </a>
          .<br />
          <br />
          Wichtig: Dabei geht es nicht um die Anteile einzelner Eigentümer:innen
          an dem Grundvermögen wie beispielsweise 1/2 bei Ehepaaren.
        </IntroText>
        <StepFormFields {...inputData} />
      </div>
    );
  } else {
    return (
      <ContentContainer size="sm-md">
        <StepFormFields {...inputData} />
      </ContentContainer>
    );
  }
};

export default Garagen;
