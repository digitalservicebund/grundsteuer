import { FormGroup, RadioGroup } from "~/components";
import { StepDefinition } from "~/domain/steps/index.server";
import { StepFormData } from "~/domain/model";

type NutzungsartRadioGroupProps = {
  stepDefinition: StepDefinition;
  formData: StepFormData;
  errors: Record<string, string>;
  options: { value: string; label: string; description: JSX.Element }[];
};

const FIELD_NAME = "privat";

export const NutzungsartRadioGroup = (props: NutzungsartRadioGroupProps) => {
  return (
    <FormGroup>
      <RadioGroup
        {...props.stepDefinition}
        {...{ error: props.errors?.[FIELD_NAME] }}
        value={props.formData?.[FIELD_NAME]}
        name={FIELD_NAME}
        options={props.options}
      />
    </FormGroup>
  );
};
