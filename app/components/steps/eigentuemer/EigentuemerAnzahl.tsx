import { ContentContainer, StepFormFields } from "~/components";
import HelpEigentuemerAnzahl from "~/components/form/help/eigentuemer/EigentuemerAnzahl";
import Person from "~/components/icons/mui/Person";
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
    attributes: [
      {
        label: "Name",
        values: allData.eigentuemer?.person?.map((person) =>
          person?.persoenlicheAngaben?.vorname
            ? `${person?.persoenlicheAngaben?.vorname} ${person?.persoenlicheAngaben?.name}`
            : undefined
        ),
      },
    ],
    help: <HelpEigentuemerAnzahl />,
    labelIcon: <Person />,
  };

  return <Anzahl {...anzahlProps} />;
};

export default EigentuemerAnzahl;
