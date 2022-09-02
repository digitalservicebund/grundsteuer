import {
  validateBiggerThan,
  validateFloat,
  validateMinValue,
  validateNoZero,
  validateOnlyDecimal,
} from "~/domain/validation/numericValidation";

describe("validateOnlyDecimal", () => {
  const cases = [
    { value: "1", exceptions: undefined, valid: true },
    { value: "0", exceptions: undefined, valid: true },
    { value: "  1  ", exceptions: undefined, valid: true },
    { value: "01", exceptions: undefined, valid: true },
    { value: "", exceptions: undefined, valid: true },
    { value: undefined, exceptions: undefined, valid: true },
    { value: "1e", exceptions: undefined, valid: false },
    { value: "text", exceptions: undefined, valid: false },
    { value: "0,9", exceptions: undefined, valid: false },
    { value: "0.9", exceptions: undefined, valid: false },
    { value: "-1", exceptions: undefined, valid: false },
    { value: "1 2", exceptions: undefined, valid: false },
    { value: "1 2", exceptions: [" "], valid: true },
    { value: "1  2", exceptions: [" "], valid: true },
    { value: "1\\2", exceptions: [" "], valid: false },
    { value: "1\\2", exceptions: [" ", "\\"], valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and exceptions $exceptions",
    ({ value, exceptions, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateOnlyDecimal({ value, exceptions })).toBe(valid);
    }
  );
});

describe("validateNoZero", () => {
  const cases = [
    { value: "0", valid: false },
    { value: "00", valid: false },
    { value: " 00 ", valid: false },
    { value: "0,0", valid: false },
    { value: "0,1", valid: true },
    { value: "1,0", valid: true },
    { value: " 1  ", valid: true },
    { value: "01", valid: true },
    { value: "", valid: true },
    { value: undefined, valid: true },
    { value: "1e", valid: true },
    { value: "text", valid: true },
    { value: "0.,0", valid: true },
    { value: "0.0", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateNoZero({ value })).toBe(valid);
    }
  );
});

describe("validateFloat", () => {
  const cases = [
    { value: "0", valid: true },
    { value: " 1  ", valid: true },
    { value: "01", valid: true },
    { value: "", valid: true },
    { value: undefined, valid: true },
    { value: "1e", valid: false },
    { value: "text", valid: false },
    { value: "0,9", valid: true },
    { value: "0.9", valid: false },
    { value: "1,9 0", valid: false },
    { value: "1234,9876", valid: true },
    { value: "-1,9", valid: false },
    { value: ",", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateFloat({ value })).toBe(valid);
    }
  );
});

describe("validateMinValue", () => {
  const cases = [
    { value: "", minValue: 2, valid: true },
    { value: "a", minValue: 2, valid: true },
    { value: "-1", minValue: 2, valid: true },
    { value: "2", minValue: 2, valid: true },
    { value: "3", minValue: 2, valid: true },
    { value: "1", minValue: 2, valid: false },
    { value: "1", minValue: 1, valid: true },
  ];

  test.each(cases)(
    "Should return $valid if minValue is minValue and value is '$value'",
    ({ value, valid, minValue }) => {
      expect(validateMinValue({ value, minValue })).toBe(valid);
    }
  );
});

describe("validateRequiredIfvalidateBiggerThan", () => {
  const cases = [
    { value: "", dependentValue: " ", valid: true },
    { value: "1", dependentValue: "", valid: true },
    { value: "", dependentValue: "1", valid: true },
    { value: "2", dependentValue: "1", valid: true },
    { value: "1", dependentValue: "1", valid: false },
    { value: "0", dependentValue: "1", valid: false },
    { value: "0.2", dependentValue: "0.1", valid: true },
    { value: "0.1", dependentValue: "0.2", valid: false },
    { value: "0,2", dependentValue: "0,1", valid: true },
    { value: "0,1", dependentValue: "0,2", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and dependentValue is '$dependentValue'",
    ({ value, dependentValue, valid }) => {
      expect(validateBiggerThan({ value, dependentValue })).toBe(valid);
    }
  );
});
