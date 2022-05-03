import type { StepComponentFunction } from "~/routes/formular/_step";
import { FormGroup, StepFormField } from "~/components";
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
        <h2 className="mb-16 font-bold">{i18n.specifics.subHeadingName}</h2>
        <FormGroup>
          <StepFormField {...fieldProps[0]} />
        </FormGroup>
      </div>
      <fieldset className="flex-row mb-32">
        <h2 className="mb-16 font-bold">{i18n.specifics.subHeadingAdresse}</h2>
        {fieldProps.map((fieldProp, idx) => {
          {
            return (
              idx != 0 && (
                <FormGroup>
                  <StepFormField {...{ ...fieldProp, key: fieldProp.name }} />
                </FormGroup>
              )
            );
          }
        })}
      </fieldset>
    </div>
  );
};

export default BruchteilsgemeinschaftAngaben;
