import { ValidateFunctionDefault } from "~/domain/validation/ValidateFunction";
import validator from "validator";

export const validateHausnummer: ValidateFunctionDefault = ({ value }) => {
  if (!value) return true;
  if (value.length > 14) return false; // hausnummer + hausnummerzusatz
  if (!validator.isInt(value[0])) return false; // start with number
  // if value (minus first number) is too long to fit into hausnummerzusatz:
  // make sure it also starts with the correct count of numbers
  return !(
    value.length > 11 && !validator.isDecimal(value.slice(0, value.length - 10))
  );
};
