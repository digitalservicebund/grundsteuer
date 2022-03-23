import invariant from "tiny-invariant";
import { ConfigStepField } from "~/domain/config";
import { StepFormData, StepFormDataValue } from "~/domain/model";

const VALID_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface EmailValidation {
  msg: string;
}

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
  | EmailValidation
  | RequiredValidation
  | RequiredIfValidation
  | MaxLengthValidation;

type ValidatorFunction = (
  fieldValue: StepFormDataValue | FormDataEntryValue,
  validationConfig: Validation,
  formData?: StepFormData
) => string | undefined;

export function validateField(
  name: string,
  field: ConfigStepField,
  formData: StepFormData
) {
  return Object.keys(field.validations).reduce(
    (previousErrorMessages: string[], validationKey: string) => {
      const validatorFunction: ValidatorFunction =
        validatorFunctions[validationKey];
      invariant(formData[name] != null);
      const errorMessage = validatorFunction(
        formData[name],
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

export const validateEmail: ValidatorFunction = (
  fieldValue,
  validationConfig
) => {
  invariant(
    typeof fieldValue === "string",
    "expected field value to be of type string"
  );

  if (!fieldValue.match(VALID_EMAIL)) {
    return validationConfig.msg;
  }
};

export const validateMaxLength: ValidatorFunction = (
  fieldValue,
  validationConfig
) => {
  invariant(
    typeof fieldValue === "string",
    "expected field value to be of type string"
  );
  if (
    fieldValue &&
    fieldValue.length > (validationConfig as MaxLengthValidation).param
  ) {
    return validationConfig.msg;
  }
};

export const validateRequired: ValidatorFunction = (
  fieldValue,
  validationConfig
) => {
  if (!fieldValue) {
    return validationConfig.msg;
  }
};

export const validateRequiredIf: ValidatorFunction = (
  fieldValue,
  validationConfig,
  formData
) => {
  invariant(formData, "expected formData to be present");
  const dependentFieldValue =
    formData[(validationConfig as RequiredIfValidation).dependentField];

  if (dependentFieldValue && !fieldValue) {
    return validationConfig.msg;
  }
};

const validatorFunctions: Record<string, ValidatorFunction> = {
  email: validateEmail,
  maxLength: validateMaxLength,
  required: validateRequired,
  requiredIf: validateRequiredIf,
};
