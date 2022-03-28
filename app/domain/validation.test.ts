import {
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validateRequired,
  validateRequiredIf,
} from "./validation";

describe("validateEmail", () => {
  const cases = [
    { value: "user@example.com", valid: true },
    { value: "  user@example.com  ", valid: false },
    { value: "user@example", valid: false },
    { value: "user", valid: false },
    { value: "", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateEmail(value)).toBe(valid);
    }
  );
});

describe("validateMaxLength", () => {
  const cases = [
    { value: "", maxLength: 1, valid: true },
    { value: "a", maxLength: 1, valid: true },
    { value: "  aa  ", maxLength: 2, valid: true },
    { value: "aa", maxLength: 1, valid: false },
  ];

  test.each(cases)(
    "Should return $valid if maxLength is $maxLength and value is '$value'",
    ({ value, valid, maxLength }) => {
      expect(validateMaxLength(value, maxLength)).toBe(valid);
    }
  );
});

describe("validateMinLength", () => {
  const cases = [
    { value: "a", minLength: 1, valid: true },
    { value: "aa", minLength: 1, valid: true },
    { value: "  ", minLength: 1, valid: false },
    { value: "a", minLength: 2, valid: false },
  ];

  test.each(cases)(
    "Should return $valid if minLength is $minLength and value is '$value'",
    ({ value, valid, minLength }) => {
      expect(validateMinLength(value, minLength)).toBe(valid);
    }
  );
});

describe("validateRequired", () => {
  const cases = [
    { value: "a", valid: true },
    { value: "  ", valid: false },
    { value: "", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateRequired(value)).toBe(valid);
    }
  );
});

describe("validateRequiredIf", () => {
  const cases = [
    { value: "", dependentValue: " ", valid: true },
    { value: "a", dependentValue: "", valid: true },
    { value: " ", dependentValue: "a", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and dependentValue is '$dependentValue'",
    ({ value, dependentValue, valid }) => {
      expect(validateRequiredIf(value, dependentValue)).toBe(valid);
    }
  );
});
