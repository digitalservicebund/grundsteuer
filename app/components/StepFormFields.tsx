import { StepFormField } from "~/components";
import { I18nObjectField } from "~/routes/formular/_step";

export type StepFormFieldsProps = {
  stepDefinition?: {
    fields: Record<string, any>;
  };
  formData?: any;
  i18n: {
    fields: {
      [index: string]: I18nObjectField;
    };
  };
  currentState?: string;
};

const StepFormFields = (props: StepFormFieldsProps) => {
  const { stepDefinition, formData, i18n, currentState } = props;
  return (
    <>
      {stepDefinition &&
        Object.entries(stepDefinition.fields).map(([name, definition]) => (
          <StepFormField
            {...{
              name,
              definition,
              i18n: i18n.fields[name],
              value: formData?.[name],
              key: `${currentState}${name}`,
            }}
          />
        ))}
    </>
  );
};

export default StepFormFields;
