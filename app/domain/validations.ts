import invariant from "tiny-invariant";
import { ConfigStepFieldValidation } from "~/domain/config";
import { StepFormData, StepFormDataValue } from "~/domain/model";

export interface RequiredValidation {
  msg: string;
}

export interface MaxLengthValidation {
  msg: string;
  param: number;
}

export type Validation = RequiredValidation | MaxLengthValidation;

type ValidatorFunction = (
  fieldValue: StepFormDataValue,
  validationConfig: Validation
) => string | undefined;

export function validateField(
  field: ConfigStepFieldValidation,
  formData: StepFormData
) {
  return Object.keys(field.validations).reduce(
    (previousErrorMessages: string[], validationKey: string) => {
      const validatorFunction: ValidatorFunction =
        validatorFunctions[validationKey];
      invariant(formData[field.name] != null);
      const errorMessage = validatorFunction(
        formData[field.name],
        field.validations[validationKey]
      );
      if (errorMessage) {
        return [...previousErrorMessages, errorMessage];
      }
      return previousErrorMessages;
    },
    []
  );
}

function required(
  fieldValue: StepFormDataValue,
  validationConfig: Validation
): string | undefined {
  if (!fieldValue) {
    return validationConfig.msg;
  }
}

function maxLength(
  fieldValue: StepFormDataValue,
  validationConfig: Validation
): string | undefined {
  if (
    fieldValue &&
    fieldValue.length > (validationConfig as MaxLengthValidation).param
  ) {
    return validationConfig.msg;
  }
}

const validatorFunctions: Record<string, ValidatorFunction> = {
  required,
  maxLength,
};
