import type { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, FormGroup, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";
import MiteigentumWohnungHelp from "~/components/form/help/grundstueck/miteigentum/MiteigentumWohnung";
import GrundbuchblattHelp from "~/components/form/help/grundstueck/Grundbuchblatt";
import Help from "~/components/form/help/Help";

const MiteigentumsanteilWohnung: StepComponentFunction = ({
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
          help={<MiteigentumWohnungHelp />}
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

export default MiteigentumsanteilWohnung;
