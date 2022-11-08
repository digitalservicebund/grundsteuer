import { ValidateFlurstueckGroesseFunction } from "~/domain/validation/ValidateFunction";

export const validateFlurstueckGroesse: ValidateFlurstueckGroesseFunction = ({
  valueHa,
  valueA,
  valueQm,
}) => {
  if (!isZeroOrEmpty(valueHa)) {
    return valueA.trim().length <= 2 && valueQm.trim().length <= 2;
  }
  if (!isZeroOrEmpty(valueA)) {
    return valueQm.trim().length <= 2;
  }
  return !isEmpty(valueQm) || !isEmpty(valueHa) || !isEmpty(valueA);
};

export const validateFlurstueckGroesseLength: ValidateFlurstueckGroesseFunction =
  ({ valueHa, valueA, valueQm }) => {
    return (
      valueHa.trim().length + valueA.trim().length + valueQm.trim().length <= 9
    );
  };

export const validateFlurstueckGroesseRequired: ValidateFlurstueckGroesseFunction =
  ({ valueHa, valueA, valueQm }) => {
    return ![valueHa, valueA, valueQm].every((value) => isEmpty(value));
  };

const isZeroOrEmpty = (value: string) => {
  return /^[0 ]*$/.test(value);
};

const isEmpty = (value: string) => {
  return /^[ ]*$/.test(value);
};
