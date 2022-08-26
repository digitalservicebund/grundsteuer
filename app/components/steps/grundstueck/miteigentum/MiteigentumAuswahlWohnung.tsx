import { ContentContainer, FormGroup } from "~/components";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";
import { StepComponentFunction } from "~/routes/formular/_step";
import { getFieldProps } from "~/util/getFieldProps";
import miteigentumNone from "~/assets/images/miteigentum/miteigentum-none.svg";
import miteigentumGarage from "~/assets/images/miteigentum/miteigentum-garage.svg";
import miteigentumMixed from "~/assets/images/miteigentum/miteigentum-mixed.svg";
import invariant from "tiny-invariant";

const MiteigentumAuswahlWohnung: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: miteigentumNone,
      imageAltText: "Bildbeispiel für eine Wohnung ohne Miteigentumsanteile",
    },
    {
      image: miteigentumGarage,
      imageAltText: "Bildbeispiel für eine Wohnung mit zugehöriger Garage",
    },
    {
      image: miteigentumMixed,
      imageAltText:
        "Bildbeispiel für eine Wohnung mit mehreren Miteigentumsanteilen",
    },
  ];

  invariant(typeof currentState !== "undefined", "currentState must be set");

  return (
    <ContentContainer size="md">
      <FormGroup>
        <RadioWithImageGroup
          {...extractRadioWithImageGroupProps(
            fieldProps,
            imagesAndAltTexts,
            currentState
          )}
        />
      </FormGroup>
    </ContentContainer>
  );
};

export default MiteigentumAuswahlWohnung;
