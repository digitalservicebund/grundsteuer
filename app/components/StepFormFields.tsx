import React from "react";
import { StepFormField } from "~/components";

export type StepFormFieldsProps = {
  stepDefinition?: {
    fields: Record<string, any>;
  };
  formData?: any;
  i18n: {
    fields: {
      [index: string]: {
        label: string;
        options?: Record<string, string>;
      };
    };
  };
};

const StepFormFields = (props: StepFormFieldsProps) => {
  const { stepDefinition, formData, i18n } = props;
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
              key: name,
            }}
          />
        ))}
    </>
  );
};

export default StepFormFields;
