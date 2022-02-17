import invariant from "tiny-invariant";
import { ConfigStepField } from "~/domain/config";
import { StepFormData, StepFormDataValue } from "~/domain/model";

export interface RequiredValidation {
  msg: string;
}

export interface MaxLengthValidation {
  msg: string;
  param: number;
}

export interface RequiredIfValidation {
  msg: string;
  dependentField: string;
}

export type Validation =
  | RequiredValidation
  | RequiredIfValidation
  | MaxLengthValidation;

type ValidatorFunction = (
  fieldValue: StepFormDataValue,
  validationConfig: Validation,
  formData: StepFormData
) => string | undefined;

export function validateField(field: ConfigStepField, formData: StepFormData) {
  return Object.keys(field.validations).reduce(
    (previousErrorMessages: string[], validationKey: string) => {
      const validatorFunction: ValidatorFunction =
        validatorFunctions[validationKey];
      invariant(formData[field.name] != null);
      const errorMessage = validatorFunction(
        formData[field.name],
        field.validations[validationKey],
        formData
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
  validationConfig: Validation,
  formData: StepFormData
): string | undefined {
  if (!fieldValue) {
    return validationConfig.msg;
  }
}

function requiredIf(
  fieldValue: StepFormDataValue,
  validationConfig: Validation,
  formData: StepFormData
): string | undefined {
  const dependentFieldValue =
    formData[(validationConfig as RequiredIfValidation).dependentField];

  if (dependentFieldValue && !fieldValue) {
    return validationConfig.msg;
  }
}

function maxLength(
  fieldValue: StepFormDataValue,
  validationConfig: Validation,
  formData: StepFormData
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
  requiredIf,
  maxLength,
};
