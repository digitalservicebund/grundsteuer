import { StepComponentFunction } from "~/routes/formular/_step";
import RadioWithImageGroup, {
  extractRadioWithImageGroupProps,
} from "~/components/form/RadioWithImageGroup";

import einfamilienhausIcon from "~/assets/images/icon_einfamilienhaus.svg";
import zweifamilienhausIcon from "~/assets/images/icon_zweifamilienhaus.svg";
import eigentumswohnungIcon from "~/assets/images/icon_eigentumswohnung.svg";
import { ContentContainer, FormGroup } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import invariant from "tiny-invariant";

const Haustyp: StepComponentFunction = ({
  stepDefinition,
  currentState,
  formData,
  i18n,
  errors,
}) => {
  console.log(i18n);
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

export default Haustyp;
