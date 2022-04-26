import { ZusammenfassungFields } from "~/domain/steps/zusammenfassung";
import { StepDefinition } from "~/domain/steps";
import { I18nObject } from "~/i18n/getStepI18n";

export const getFieldProps = (
  stepDefinition: StepDefinition,
  formData: Record<string, any>,
  i18n: I18nObject,
  errors?: Record<string, string>
) => {
  const fieldDefinitions = stepDefinition.fields;
  const fieldNames = Object.keys(fieldDefinitions);
  return fieldNames.map((fieldName) => {
    return {
      name: fieldName,
      value: formData?.[fieldName],
      i18n: i18n.fields[fieldName],
      definition: fieldDefinitions[fieldName as keyof ZusammenfassungFields],
      error: errors?.[fieldName],
    };
  });
};
