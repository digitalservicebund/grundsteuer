import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
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
      <InputRow>
        <StepFormField {...fieldProps[0]} />
        <StepFormField {...fieldProps[1]} />
        <StepFormField {...fieldProps[2]} />
      </InputRow>
    </div>
  );
};

export default FlurstueckGroesse;
