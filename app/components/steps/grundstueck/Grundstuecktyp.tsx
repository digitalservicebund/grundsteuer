import { StepComponentFunction } from "~/routes/formular/_step";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";

import baureifIcon from "~/assets/images/icon_baureif.svg";
import unbebautIcon from "~/assets/images/icon_unbebaut.svg";
import rohbaulandIcon from "~/assets/images/icon_rohbauland.svg";
import { ContentContainer, FormGroup } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import invariant from "tiny-invariant";

const Grundstuecktyp: StepComponentFunction = ({
  stepDefinition,
  currentState,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: baureifIcon,
      imageAltText:
        "Grafische Darstellung eines Geländes, auf dem Platz für ein Haus ist",
    },
    {
      image: unbebautIcon,
      imageAltText:
        "Grafische Darstellung eines unbebauten Geländes mit Bäumen",
    },
    {
      image: unbebautIcon,
      imageAltText:
        "Grafische Darstellung eines unbebauten Geländes mit Bäumen",
    },
    {
      image: rohbaulandIcon,
      imageAltText:
        "Grafische Darstellung eines unerschlossenen Geländes mit unebenem Boden und Bäumen",
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

export default Grundstuecktyp;
