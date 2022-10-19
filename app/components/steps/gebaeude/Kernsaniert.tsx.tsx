import { ContentContainer, FormGroup } from "~/components";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";
import { StepComponentFunction } from "~/routes/formular/_step";
import { getFieldProps } from "~/util/getFieldProps";
import kernsaniertIcon from "~/assets/images/icon_kernsaniert.svg";
import nichtKernsaniertIcon from "~/assets/images/icon_nicht_kernsaniert.svg";
import invariant from "tiny-invariant";

const Kernsaniert: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: nichtKernsaniertIcon,
      imageAltText: "",
    },
    {
      image: kernsaniertIcon,
      imageAltText: "",
    },
  ];

  invariant(typeof currentState !== "undefined", "currentState must be set");

  return (
    <ContentContainer size="sm-md">
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

export default Kernsaniert;
