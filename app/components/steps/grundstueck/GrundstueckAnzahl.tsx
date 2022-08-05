import { ContentContainer, StepFormFields } from "~/components";
import HelpGrundstueckAnzahl from "~/components/form/help/grundstueck/GrundstueckAnzahl";
import House from "~/components/icons/mui/House";
import Anzahl from "~/components/steps/Anzahl";
import { calculateGroesse } from "~/erica/transformData";
import { GRUNDSTUECK_ANZAHL_MAX } from "~/routes/formular/_anzahlAction";
import { StepComponentFunction } from "~/routes/formular/_step";

const GrundstueckAnzahl: StepComponentFunction = ({
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
    anzahl: allData?.grundstueck?.anzahl?.anzahl,
    maxAnzahl: GRUNDSTUECK_ANZAHL_MAX,
    itemLabelTemplate: "Grundstücksfläche [ID]",
    itemEditPathTemplate: "/formular/grundstueck/flurstueck/[ID]/angaben",
    increaseButtonLabel: "Grundstücksfläche hinzufügen",
    itemAttribute1Label: "Gemarkung",
    itemAttribute2Label: "Flurstück",
    attributeLabels: ["Flurstück", "Gesamtgröße"],
    attributes: [
      allData.grundstueck?.flurstueck?.map((flurstueck) =>
        [
          flurstueck?.flur?.flurstueckZaehler,
          flurstueck?.flur?.flurstueckNenner,
        ]
          .filter((s) => s)
          .join(" / ")
      ),
      allData.grundstueck?.flurstueck?.map((flurstueck) => {
        if (!flurstueck?.groesse) return undefined;
        try {
          return `${calculateGroesse(flurstueck.groesse)} m²`;
        } catch {
          return undefined;
        }
      }),
    ],
    help: <HelpGrundstueckAnzahl />,
    labelIcon: <House />,
  };

  return <Anzahl {...anzahlProps} />;
};

export default GrundstueckAnzahl;
