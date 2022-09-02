import { ValidateFunctionDefault } from "~/domain/validation/ValidateFunction";
import validator from "validator";

export const validateEmail: ValidateFunctionDefault = ({ value }) =>
  validator.isEmail(value);
