import StepFormField from "./StepFormField";
import { I18nObjectField } from "~/i18n/getStepI18n";
import FormGroup from "./FormGroup";

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
  errors?: Record<string, string>;
};

const StepFormFields = (props: StepFormFieldsProps) => {
  const { stepDefinition, formData, i18n, currentState, errors } = props;
  return (
    <>
      {stepDefinition &&
        Object.entries(stepDefinition.fields).map(([name, definition]) => (
          <FormGroup>
            <StepFormField
              {...{
                name,
                definition,
                i18n: i18n.fields[name],
                value: formData?.[name],
                key: `${currentState}${name}`,
                error: errors?.[name],
              }}
            />
          </FormGroup>
        ))}
    </>
  );
};

export default StepFormFields;
