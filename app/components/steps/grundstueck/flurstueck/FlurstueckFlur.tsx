import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, IntroText, StepFormField, SubHeadline } from "~/components";
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
      <IntroText>{i18n.specifics.explanation}</IntroText>
      <div>
        <FormGroup>
          <StepFormField {...fieldProps[0]} />
        </FormGroup>
        <FormGroup>
          <SubHeadline>{i18n.specifics.flurstueckSubheading}</SubHeadline>
          <InputFraction
            zaehler={<StepFormField {...fieldProps[1]} />}
            nenner={<StepFormField {...fieldProps[2]} />}
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default FlurstueckFlur;
