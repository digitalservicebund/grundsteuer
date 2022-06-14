import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer } from "~/components";

const EigentuemerAbschluss: StepComponentFunction = () => {
  return (
    <ContentContainer size="sm-md">
      <p className="mb-32">
        Bevor Sie Ihre Grundsteuererklärung an Ihr Finanzamt übermitteln,
        überprüfen Sie bitte Ihre Angaben auf der nächsten Seite.
      </p>
    </ContentContainer>
  );
};

export default EigentuemerAbschluss;
