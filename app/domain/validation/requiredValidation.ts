import {
  ValidateDependentFunction,
  ValidateFunctionDefault,
  ValidateRequiredIfConditionFunction,
} from "~/domain/validation/ValidateFunction";

export const validateRequired: ValidateFunctionDefault = ({ value }) =>
  value.trim().length > 0;

export const validateRequiredIf: ValidateDependentFunction = ({
  value,
  dependentValue,
}) =>
  !dependentValue || validateRequired({ value: dependentValue })
    ? validateRequired({ value })
    : true;

export const validateRequiredIfCondition: ValidateRequiredIfConditionFunction =
  ({ value, condition, allData }) =>
    condition(allData) ? validateRequired({ value }) : true;

export const validateForbiddenIf: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => !dependentValue || (dependentValue.trim() ? !value.trim() : true);

export const validateEitherOr: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => (dependentValue?.trim() ? !value.trim() : !!value.trim());
