import StepFormField from "./StepFormField";
import { I18nObjectField } from "~/i18n/getStepI18n";
import FormGroup from "./FormGroup";
import { GrundModel, StepDefinition } from "~/domain/steps/index.server";

export type StepFormFieldsProps = {
  stepDefinition?: StepDefinition;
  formData?: any;
  i18n: {
    fields: {
      [index: string]: I18nObjectField;
    };
  };
  currentState?: string;
  errors?: Record<string, string>;
  allData?: GrundModel;
};

const StepFormFields = (props: StepFormFieldsProps) => {
  const { stepDefinition, formData, i18n, currentState, errors, allData } =
    props;
  return (
    <>
      {stepDefinition &&
        Object.entries(stepDefinition.fields).map(([name, definition]) => (
          <FormGroup key={`${currentState}${name}`}>
            <StepFormField
              {...{
                name,
                definition,
                currentState,
                i18n: i18n.fields[name],
                value: formData?.[name],
                error: errors?.[name],
                allData,
              }}
            />
          </FormGroup>
        ))}
    </>
  );
};

export default StepFormFields;
