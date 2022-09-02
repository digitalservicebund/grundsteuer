import {
  ValidateDependentFunction,
  ValidateFunctionDefault,
  ValidateMinValueFunction,
  ValidateOnlyDecimalFunction,
} from "~/domain/validation/ValidateFunction";
import validator from "validator";

export const validateOnlyDecimal: ValidateOnlyDecimalFunction = ({
  value,
  exceptions,
}) => {
  if (!value) return true;
  let valueWithoutExceptions = value;
  exceptions?.forEach(
    (exception) =>
      (valueWithoutExceptions = valueWithoutExceptions
        .split(exception)
        .join(""))
  );
  return /^\d*$/.test(valueWithoutExceptions.trim());
};

export const validateNoZero: ValidateFunctionDefault = ({ value }) => {
  if (!value) return true;
  if (!validateOnlyDecimal({ value, exceptions: [","] })) return true;
  if (value.includes(",")) {
    const floatRepresentation = parseFloat(value.replace(",", "."));
    if (floatRepresentation == 0.0) return false;
  } else {
    const intRepresentation = parseInt(value);
    if (intRepresentation == 0) return false;
  }
  return true;
};

export const validateFloat: ValidateFunctionDefault = ({ value }) =>
  !value ||
  (validateOnlyDecimal({ value, exceptions: [","] }) &&
    validator.isFloat(value.trim(), { locale: "de-DE" }) &&
    value.trim() !== ",");

export const validateBiggerThan: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => {
  return (
    !value ||
    !dependentValue ||
    parseFloat(value.replace(",", ".")) >
      parseFloat(dependentValue.replace(",", "."))
  );
};

export const validateMinValue: ValidateMinValueFunction = ({
  value,
  minValue,
}) => !value || !validateOnlyDecimal({ value }) || +value >= minValue;
