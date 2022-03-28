import invariant from "tiny-invariant";
import { StepFormData } from "~/domain/model";
import validator from "validator";

type ValidateEmailFunction = (value: string) => boolean;
export const validateEmail: ValidateEmailFunction = (value) =>
  validator.isEmail(value);

type ValidateMinLengthFunction = (value: string, minLength: number) => boolean;
export const validateMinLength: ValidateMinLengthFunction = (
  value,
  minLength
) => value.trim().length >= minLength;

type ValidateMaxLengthFunction = (value: string, maxLength: number) => boolean;
export const validateMaxLength: ValidateMaxLengthFunction = (
  value,
  maxLength
) => value.trim().length <= maxLength;

type ValidateRequiredFunction = (value: string) => boolean;
export const validateRequired: ValidateRequiredFunction = (value) =>
  value.trim().length > 0;

type ValidateRequiredIfFunction = (
  value: string,
  dependentValue: string
) => boolean;
export const validateRequiredIf: ValidateRequiredIfFunction = (
  value,
  dependentValue
) => (validateRequired(dependentValue) ? validateRequired(value) : true);

interface DefaultValidation {
  msg: string;
}

interface MinLengthValidation extends DefaultValidation {
  minLength: number;
}

interface MaxLengthValidation extends DefaultValidation {
  maxLength: number;
}

interface RequiredIfValidation extends DefaultValidation {
  dependentField: string;
}

export type Validation =
  | DefaultValidation
  | RequiredIfValidation
  | MaxLengthValidation
  | MinLengthValidation;

type ValidationConfig = Record<string, Validation>;

export const getErrorMessage = (
  value: string,
  validationConfig: ValidationConfig,
  formData: StepFormData
) => {
  const { email, maxLength, minLength, required, requiredIf } =
    validationConfig;

  if (required && !validateRequired(value)) {
    return required.msg;
  }

  if (requiredIf) {
    const dependentValue =
      formData[(requiredIf as RequiredIfValidation).dependentField];
    invariant(typeof dependentValue === "string");
    if (!validateRequiredIf(value, dependentValue)) {
      return requiredIf.msg;
    }
  }

  if (email && !validateEmail(value)) {
    return email.msg;
  }

  if (
    minLength &&
    !validateMinLength(value, (minLength as MinLengthValidation).minLength)
  ) {
    return minLength.msg;
  }

  if (
    maxLength &&
    !validateMaxLength(value, (maxLength as MaxLengthValidation).maxLength)
  ) {
    return maxLength.msg;
  }
};
