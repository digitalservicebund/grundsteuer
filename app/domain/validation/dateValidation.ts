import {
  ValidateFunctionDefault,
  ValidateYearAfterBaujahrFunction,
  ValidateYearInPast,
} from "~/domain/validation/ValidateFunction";
import { validateOnlyDecimal } from "~/domain/validation/numericValidation";
import validator from "validator";

export const validateIsDate: ValidateFunctionDefault = ({ value }) =>
  !value ||
  (value.trim().length == "DD.MM.YYYY".length && // include this check as long as this is not merged: https://github.com/validatorjs/validator.js/pull/2056
    validator.isDate(value.trim(), {
      format: "DD.MM.YYYY",
      strictMode: true,
      delimiters: ["."],
    }));

export const validateYearAfterBaujahr: ValidateYearAfterBaujahrFunction = ({
  value,
  allData,
}) => {
  const baujahr = allData.gebaeude?.baujahr?.baujahr;
  if (!value || !baujahr) return true;
  return +value >= +baujahr;
};

export const validateYearInFuture: ValidateFunctionDefault = ({ value }) => {
  if (!validateOnlyDecimal({ value })) return true;
  if (value.length != 4) return true;
  return +value >= new Date(Date.now()).getFullYear();
};

export const validateYearInPast: ValidateYearInPast = ({
  value,
  excludingCurrentYear,
}) => {
  if (!validateOnlyDecimal({ value })) return true;
  if (value.length != 4) return true;

  if (excludingCurrentYear) {
    return +value < new Date(Date.now()).getFullYear();
  } else {
    return +value <= new Date(Date.now()).getFullYear();
  }
};

// Because of potentially different timezones, the current implementation
// cannot be reliably used if the input date is not at least 1 day in the past.
export const validateDateInPast: ValidateFunctionDefault = ({ value }) => {
  if (!value || !validateIsDate({ value })) return true;
  const splitDate = value.split(".");
  return (
    Date.UTC(+splitDate[2], +splitDate[1] - 1, +splitDate[0]) <= Date.now()
  );
};
