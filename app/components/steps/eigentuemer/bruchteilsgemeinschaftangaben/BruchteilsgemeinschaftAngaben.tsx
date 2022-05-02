import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";

const BruchteilsgemeinschaftAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div>
      <div className="mb-32">
        <h2 className="font-bold mb-16">{i18n.specifics.subHeadingName}</h2>
        <StepFormField {...fieldProps[0]} />
      </div>
      <fieldset className="flex-row mb-32">
        <h2 className="font-bold mb-16">{i18n.specifics.subHeadingAdresse}</h2>
        {fieldProps.map((fieldProp, idx) => {
          {
            return (
              idx != 0 && (
                <StepFormField {...{ ...fieldProp, key: fieldProp.name }} />
              )
            );
          }
        })}
      </fieldset>
    </div>
  );
};

export default BruchteilsgemeinschaftAngaben;
