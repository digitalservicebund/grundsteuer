import { StepComponentFunction } from "~/routes/formular/_step";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";

import einfamilienhausIcon from "~/assets/images/icon_einfamilienhaus.svg";
import zweifamilienhausIcon from "~/assets/images/icon_zweifamilienhaus.svg";
import eigentumswohnungIcon from "~/assets/images/icon_eigentumswohnung.svg";
import baureifIcon from "~/assets/images/icon_baureif.svg";
import unbebautIcon from "~/assets/images/icon_unbebaut.svg";
import { FormGroup } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import invariant from "tiny-invariant";

const GrundstueckTyp: StepComponentFunction = ({
  stepDefinition,
  currentState,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors)[0];
  const imagesAndAltTexts = [
    {
      image: einfamilienhausIcon,
      imageAltText: "Grafische Darstellung eines Einfamilienhauses",
    },
    {
      image: zweifamilienhausIcon,
      imageAltText: "Grafische Darstellung eines Zweifamilienhauses",
    },
    {
      image: eigentumswohnungIcon,
      imageAltText: "Grafische Darstellung eines Mehrfamilienhauses",
    },
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
  ];

  invariant(typeof currentState !== "undefined", "currentState must be set");
  return (
    <FormGroup>
      <RadioWithImageGroup
        {...extractRadioWithImageGroupProps(
          fieldProps,
          imagesAndAltTexts,
          currentState
        )}
      />
    </FormGroup>
  );
};

export default GrundstueckTyp;
