import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, IntroText, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";

const FlurstueckMiteigentumsanteil: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div>
      <IntroText>{i18n.description}</IntroText>
      <FormGroup>
        <InputFraction
          zaehler={<StepFormField {...fieldProps[0]} />}
          nenner={<StepFormField {...fieldProps[1]} />}
        />
      </FormGroup>
    </div>
  );
};

export default FlurstueckMiteigentumsanteil;
