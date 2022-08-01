import { ContentContainer, StepFormFields } from "~/components";
import HelpEigentuemerAnzahl from "~/components/form/help/eigentuemer/EigentuemerAnzahl";
import Anzahl from "~/components/steps/Anzahl";
import { EIGENTUEMER_ANZAHL_MAX } from "~/routes/formular/_anzahlAction";
import { StepComponentFunction } from "~/routes/formular/_step";

const EigentuemerAnzahl: StepComponentFunction = ({
  stepDefinition,
  currentState,
  allData,
  formData,
  i18n,
  errors,
  testFeaturesEnabled,
}) => {
  if (!testFeaturesEnabled) {
    return (
      <ContentContainer size="sm-md">
        <StepFormFields
          {...{ stepDefinition, currentState, formData, i18n, errors, allData }}
        />
      </ContentContainer>
    );
  }

  const anzahlProps = {
    anzahl: allData?.eigentuemer?.anzahl?.anzahl,
    maxAnzahl: EIGENTUEMER_ANZAHL_MAX,
    itemLabelTemplate: "Eigentümer:in [ID]",
    itemEditPathTemplate:
      "/formular/eigentuemer/person/[ID]/persoenlicheAngaben",
    increaseButtonLabel: "Eigentümer:in hinzufügen",
    itemAttribute1Label: "Vorname",
    itemAttribute2Label: "Nachname",
    itemAttributes1: allData.eigentuemer?.person?.map(
      (person) => person?.persoenlicheAngaben?.vorname
    ),
    itemAttributes2: allData.eigentuemer?.person?.map(
      (person) => person?.persoenlicheAngaben?.name
    ),
    help: <HelpEigentuemerAnzahl />,
  };

  return <Anzahl {...anzahlProps} />;
};

export default EigentuemerAnzahl;
