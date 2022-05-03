import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, StepFormField, SubHeadline } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";

const FlurstueckFlur: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div>
      <div>
        <FormGroup>
          <StepFormField {...fieldProps[0]} />
        </FormGroup>
        <FormGroup>
          <InputFraction
            zaehler={<StepFormField {...fieldProps[1]} />}
            nenner={<StepFormField {...fieldProps[2]} />}
          />
        </FormGroup>
      </div>
      <SubHeadline>{i18n.specifics.subHeadingAnteil}</SubHeadline>
      <FormGroup>
        <InputFraction
          zaehler={<StepFormField {...fieldProps[3]} />}
          nenner={<StepFormField {...fieldProps[4]} />}
        />
      </FormGroup>
    </div>
  );
};

export default FlurstueckFlur;
