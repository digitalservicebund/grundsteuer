import { FormGroup } from "~/components";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";
import { StepComponentFunction } from "~/routes/formular/_step";
import { getFieldProps } from "~/util/getFieldProps";
import einBodenrichtWertIcon from "~/assets/images/icon_ein_bodenrichtwert.svg";
import zweiBodenrichtWerteIcon from "~/assets/images/icon_zwei_bodenrichtwerte.svg";

const BodenrichtwertAnzahl: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: einBodenrichtWertIcon,
      imageAltText:
        "Planausschnitt, der das graue Grundstück innerhalb der roten Bodenrichtwertslinie zeigt",
    },
    {
      image: zweiBodenrichtWerteIcon,
      imageAltText:
        "Planausschnitt, der die rote Bodenrichtwertslinie zeigt, die durch das graue Grundstück hindurch geht",
    },
  ];

  return (
    <FormGroup>
      <RadioWithImageGroup
        {...extractRadioWithImageGroupProps(fieldProps, imagesAndAltTexts)}
      />
    </FormGroup>
  );
};

export default BodenrichtwertAnzahl;
