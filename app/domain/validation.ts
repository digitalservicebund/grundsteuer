import invariant from "tiny-invariant";
import { StepFormData } from "~/domain/model";
import validator from "validator";
import { Condition } from "~/domain/guards";
import { GrundModel } from "~/domain/steps";

type ValidateFunctionDefault = (value: string) => boolean;

export const validateEmail: ValidateFunctionDefault = (value) =>
  validator.isEmail(value);

export const validateOnlyDecimal: ValidateFunctionDefault = (value) =>
  !value || validator.isInt(value.trim(), { allow_leading_zeroes: true });

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

export const validateRequired: ValidateFunctionDefault = (value) =>
  value.trim().length > 0;

type ValidateRequiredIfFunction = (
  value: string,
  dependentValue: string
) => boolean;
export const validateRequiredIf: ValidateRequiredIfFunction = (
  value,
  dependentValue
) => (validateRequired(dependentValue) ? validateRequired(value) : true);

type ValidateRequiredIfCondition = (
  value: string,
  condition: Condition,
  allData: GrundModel
) => boolean;
export const validateRequiredIfCondition: ValidateRequiredIfCondition = (
  value,
  condition,
  allData
) => (condition(allData) ? validateRequired(value) : true);

export const validateHausnummer: ValidateFunctionDefault = (value) => {
  if (!value) return true;
  if (value.length > 14) return false; // hausnummer + hausnummerzusatz
  if (!validator.isInt(value[0])) return false; // start with number
  // if value (minus first number) is too long to fit into hausnummerzusatz:
  // make sure it also starts with the correct count of numbers
  if (
    value.length > 11 &&
    !validator.isDecimal(value.slice(0, value.length - 10))
  )
    return false;
  return true;
};

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

interface RequiredIfConditionValidation extends DefaultValidation {
  condition: Condition;
}

export type Validation =
  | DefaultValidation
  | RequiredIfValidation
  | RequiredIfConditionValidation
  | MaxLengthValidation
  | MinLengthValidation;

type ValidationConfig = Record<string, Validation>;

export const getErrorMessage = (
  value: string,
  validationConfig: ValidationConfig,
  formData: StepFormData,
  allData: GrundModel,
  i18n: Record<string, Record<string, string> | string>
): string | undefined => {
  const {
    email,
    onlyDecimal,
    maxLength,
    minLength,
    required,
    requiredIf,
    requiredIfCondition,
    hausnummer,
  } = validationConfig;

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

  if (
    requiredIfCondition &&
    !validateRequiredIfCondition(
      value,
      (requiredIfCondition as RequiredIfConditionValidation).condition,
      allData
    )
  ) {
    return requiredIfCondition.msg;
  }

  if (hausnummer && !validateHausnummer(value)) {
    return hausnummer.msg || (i18n.hausnummer as string);
  }

  if (email && !validateEmail(value)) {
    return email.msg;
  }

  if (onlyDecimal && !validateOnlyDecimal(value)) {
    return onlyDecimal.msg || (i18n.onlyDecimal as string);
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
