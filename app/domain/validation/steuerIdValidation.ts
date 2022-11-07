import validator from "validator";
import {
  ValidateFunctionDefault,
  ValidateUniqueSteuerIdFunction,
} from "~/domain/validation/ValidateFunction";
import { validateOnlyDecimal } from "~/domain/validation/numericValidation";
import { Person } from "~/domain/steps/index.server";

export const validateSteuerId: ValidateFunctionDefault = ({ value }) => {
  if (!value) return true;
  const normalizedSteuerId = value.split(" ").join("");
  if (value.charAt(0) != "0") {
    return validator.isTaxID(normalizedSteuerId, "de-DE");
  }
  // must contain only digits
  if (!validateOnlyDecimal({ value: normalizedSteuerId })) return false;
  // must contain 11 digits
  if (normalizedSteuerId.length != 11) return false;
  // one digit must exist exactly two or three times
  const digitsToCheck = normalizedSteuerId.slice(0, -1);
  const digitCounts = [...digitsToCheck].reduce((acc, char) => {
    acc[char] = acc[char] ? acc[char] + 1 : 1;
    return acc;
  }, {} as Record<string, number>);
  if (Object.values(digitCounts).some((count) => count > 3)) return false;
  const numbersWithMultipleOccurrences = Object.values(digitCounts).reduce(
    (acc, count) => {
      if (count > 1) acc.push(count);
      return acc;
    },
    [] as number[]
  );
  return numbersWithMultipleOccurrences.length == 1;
};

export const validateUniqueSteuerId: ValidateUniqueSteuerIdFunction = ({
  value,
  allData,
  noNewDataAdded,
}) => {
  const collectSteuerId = (
    existingSteuerIds: Array<string>,
    person: Person
  ) => {
    if (person && person.steuerId?.steuerId)
      existingSteuerIds.push(person.steuerId?.steuerId);
    return existingSteuerIds;
  };

  const containsOnlyUniqueValues = (existingSteuerIds: Array<string>) => {
    const onlyUniques = existingSteuerIds.filter(
      (steuerId, currentIndex, steuerIds) =>
        steuerIds.indexOf(steuerId) === currentIndex
    );
    return onlyUniques.length == existingSteuerIds.length;
  };

  if ("eigentuemer" in allData && allData.eigentuemer?.person) {
    const existingSteuerIds: Array<string> = allData.eigentuemer.person.reduce(
      collectSteuerId,
      []
    );

    if (noNewDataAdded) return containsOnlyUniqueValues(existingSteuerIds);
    if (value) return !existingSteuerIds.includes(value);
  }
  return true;
};
