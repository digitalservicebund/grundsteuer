import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField, SubHeadline } from "~/components";
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
      <StepFormField {...fieldProps[0]} />
      <InputFraction
        className="mb-56"
        zaehler={<StepFormField {...fieldProps[1]} />}
        nenner={<StepFormField {...fieldProps[2]} />}
      />
      <SubHeadline>{i18n.specifics.subHeadingAnteil}</SubHeadline>
      <InputFraction
        className="mb-56"
        zaehler={<StepFormField {...fieldProps[3]} />}
        nenner={<StepFormField {...fieldProps[4]} />}
      />
    </div>
  );
};

export default FlurstueckFlur;
