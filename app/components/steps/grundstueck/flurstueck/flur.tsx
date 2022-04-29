import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
import Slash from "~/components/icons/mui/Slash";
import { getFieldProps } from "~/util/getFieldProps";

const GrundstueckFlurstueckFlur: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div>
      <StepFormField {...fieldProps[0]} />
      <fieldset className="flex-row flex items-baseline">
        <div className="inline-block">
          <StepFormField {...fieldProps[1]} />
        </div>
        <Slash
          className="inline-block mx-10 h-32 mb-4 self-center"
          role="img"
        />
        <div className="inline-block">
          <StepFormField {...fieldProps[2]} />
        </div>
      </fieldset>
      <h2 className="font-bold my-8">{i18n.specifics.subHeadingAnteil}</h2>
      <fieldset className="flex-row flex items-baseline">
        <div className="inline-block">
          <StepFormField {...fieldProps[3]} />
        </div>
        <Slash
          className="inline-block mx-10 h-32 mb-4 self-center"
          role="img"
        />
        <div className="inline-block">
          <StepFormField {...fieldProps[4]} />
        </div>
      </fieldset>
    </div>
  );
};

export default GrundstueckFlurstueckFlur;
