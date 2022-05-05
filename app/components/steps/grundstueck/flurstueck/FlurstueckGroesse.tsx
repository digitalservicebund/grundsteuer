import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputRow from "~/components/form/InputRow";
import IntroText from "~/components/IntroText";

const FlurstueckGroesse: StepComponentFunction = ({
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
        <InputRow>
          <div>
            <StepFormField {...fieldProps[0]} />
          </div>
          <div>
            <StepFormField {...fieldProps[1]} />
          </div>
          <div>
            <StepFormField {...fieldProps[2]} />
          </div>
        </InputRow>
      </FormGroup>
    </div>
  );
};

export default FlurstueckGroesse;
