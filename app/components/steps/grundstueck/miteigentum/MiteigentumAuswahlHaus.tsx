import { ContentContainer, FormGroup } from "~/components";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";
import { StepComponentFunction } from "~/routes/formular/_step";
import { getFieldProps } from "~/util/getFieldProps";
import miteigentumFalse from "~/assets/images/miteigentum/miteigentum-false.svg";
import miteigentumTrue from "~/assets/images/miteigentum/miteigentum-true.svg";
import invariant from "tiny-invariant";

const MiteigentumAuswahlHaus: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: miteigentumFalse,
      imageAltText: "Bildbeispiel für ein Grundstück ohne Miteigentumsanteile",
    },
    {
      image: miteigentumTrue,
      imageAltText: "Bildbeispiel für ein Grundstück mit Miteigentumsanteilen",
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

export default MiteigentumAuswahlHaus;
