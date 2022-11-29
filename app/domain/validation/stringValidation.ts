import {
  ValidateFunctionDefault,
  ValidateMaxLengthFloatFunction,
  ValidateMaxLengthFunction,
  ValidateMinLengthFunction,
} from "~/domain/validation/ValidateFunction";
import validator from "validator";

export const validateMaxLengthFloat: ValidateMaxLengthFloatFunction = ({
  value,
  preComma,
  postComma,
}) => {
  if (!value) return true;
  const splitValues = value.trim().split(",");
  return (
    splitValues[0].length <= preComma &&
    (!splitValues[1] || splitValues[1].length <= postComma)
  );
};

export const validateMinLength: ValidateMinLengthFunction = ({
  value,
  minLength,
  exceptions,
}) => {
  if (!value) return true;
  const valueWithoutExceptions = removeAllExceptions(value, exceptions);
  return valueWithoutExceptions.trim().length >= minLength;
};

export const validateMaxLength: ValidateMaxLengthFunction = ({
  value,
  maxLength,
  exceptions,
}) => {
  if (!value) return true;
  const valueWithoutExceptions = removeAllExceptions(value, exceptions);
  return valueWithoutExceptions.trim().length <= maxLength;
};

export const validateEmail: ValidateFunctionDefault = ({ value }) =>
  validator.isEmail(value);

const removeAllExceptions = (value: string, exceptions?: string[]) => {
  exceptions?.forEach((exception) => (value = value.split(exception).join("")));
  return value;
};
