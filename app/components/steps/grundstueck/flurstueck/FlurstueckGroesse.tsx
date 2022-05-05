import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputRow from "~/components/form/InputRow";

const FlurstueckGroesse: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div>
      <div className="mb-16">{i18n.description}</div>
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
