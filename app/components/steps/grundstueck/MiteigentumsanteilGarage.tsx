import type { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, FormGroup, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";
import MiteigentumGarageHelp from "~/components/form/help/grundstueck/miteigentum/MiteigentumGarage";
import Help from "~/components/form/help/Help";
import GrundbuchblattHelp from "~/components/form/help/grundstueck/Grundbuchblatt";

const MiteigentumsanteilGarage: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <ContentContainer size="sm-md">
      <FormGroup>
        <InputFraction
          zaehler={<StepFormField {...fieldProps[0]} />}
          nenner={<StepFormField {...fieldProps[1]} />}
          help={<MiteigentumGarageHelp />}
        />
      </FormGroup>
      <FormGroup>
        <StepFormField {...fieldProps[2]} />
        <Help>
          <GrundbuchblattHelp />
        </Help>
      </FormGroup>
    </ContentContainer>
  );
};

export default MiteigentumsanteilGarage;
