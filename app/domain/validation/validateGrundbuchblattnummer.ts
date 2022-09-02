import { ValidateFunctionDefault } from "~/domain/validation/ValidateFunction";
import validator from "validator";

export const validateGrundbuchblattnummer: ValidateFunctionDefault = ({
  value,
}) => {
  if (!value) return true;
  if (value.length > 6) return false;
  if (!validator.isInt(value[0])) return false; // start with number
  if (value.length > 1 && !validator.isInt(value.slice(0, value.length - 1)))
    return false; // only last char may not be number
  return true;
};
