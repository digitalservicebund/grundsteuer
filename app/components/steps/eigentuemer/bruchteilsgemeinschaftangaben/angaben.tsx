import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
import { EigentuemerBruchteilsgemeinschaftAngabenFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";

const EigentuemerBruchteilsgemeinschaftAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldDefinitions =
    stepDefinition.fields as EigentuemerBruchteilsgemeinschaftAngabenFields;
  const fieldNames = Object.keys(fieldDefinitions);
  const fieldProps = fieldNames.map((fieldName) => {
    return {
      name: fieldName,
      value: formData?.[fieldName],
      i18n: i18n.fields[fieldName],
      definition:
        fieldDefinitions[
          fieldName as keyof EigentuemerBruchteilsgemeinschaftAngabenFields
        ],
      error: errors?.[fieldName],
    };
  });

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

export default EigentuemerBruchteilsgemeinschaftAngaben;
