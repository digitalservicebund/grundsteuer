import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
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
        zaehler={<StepFormField {...fieldProps[1]} />}
        nenner={<StepFormField {...fieldProps[2]} />}
      />
      <h2 className="font-bold my-8">{i18n.specifics.subHeadingAnteil}</h2>
      <InputFraction
        zaehler={<StepFormField {...fieldProps[3]} />}
        nenner={<StepFormField {...fieldProps[4]} />}
      />
    </div>
  );
};

export default FlurstueckFlur;
