import {
  validateEitherOr,
  validateForbiddenIf,
  validateRequired,
  validateRequiredIf,
  validateRequiredIfCondition,
} from "~/domain/validation/requiredValidation";
import { GrundModel } from "~/domain/steps";

describe("validateRequired", () => {
  const cases = [
    { value: "a", valid: true },
    { value: "  ", valid: false },
    { value: "", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateRequired({ value })).toBe(valid);
    }
  );
});

describe("validateRequiredIf", () => {
  const cases = [
    { value: "", dependentValue: " ", valid: true },
    { value: "a", dependentValue: "", valid: true },
    { value: "", dependentValue: undefined, valid: false },
    { value: "a", dependentValue: undefined, valid: true },
    { value: " ", dependentValue: "a", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and dependentValue is '$dependentValue'",
    ({ value, dependentValue, valid }) => {
      expect(validateRequiredIf({ value, dependentValue })).toBe(valid);
    }
  );
});

describe("validateRequiredIfCondition", () => {
  const falseCondition = jest.fn(() => false);
  const trueCondition = jest.fn(() => true);

  const cases = [
    { value: "", condition: falseCondition, valid: true },
    { value: "xx", condition: falseCondition, valid: true },
    { value: "", condition: trueCondition, valid: false },
    { value: "xx", condition: trueCondition, valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and condition is '$condition'",
    ({ value, condition, valid }) => {
      const allData: GrundModel = {
        grundstueck: { typ: { typ: "einfamilienhaus" } },
      };
      condition.mockClear();

      expect(validateRequiredIfCondition({ value, condition, allData })).toBe(
        valid
      );

      expect(condition.mock.calls.length).toBe(1);
      expect(condition.mock.calls[0].length).toBe(1); // one argument
      expect((condition.mock.calls[0] as Array<object>)[0]).toEqual(allData); // correct argument
    }
  );
});

describe("validateEitherOr", () => {
  const cases = [
    { value: "", dependentValue: "", valid: false },
    { value: "a", dependentValue: "", valid: true },
    { value: "", dependentValue: undefined, valid: false },
    { value: "a", dependentValue: undefined, valid: true },
    { value: "", dependentValue: "a", valid: true },
    { value: "a", dependentValue: "a", valid: false },
    { value: " ", dependentValue: " ", valid: false },
    { value: "a", dependentValue: " ", valid: true },
    { value: " ", dependentValue: "a", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and dependentValue is '$dependentValue'",
    ({ value, dependentValue, valid }) => {
      expect(validateEitherOr({ value, dependentValue })).toBe(valid);
    }
  );
});

describe("validateForbiddenIf", () => {
  const cases = [
    { value: "", dependentValue: "", valid: true },
    { value: "a", dependentValue: "", valid: true },
    { value: "a", dependentValue: undefined, valid: true },
    { value: "", dependentValue: "a", valid: true },
    { value: "a", dependentValue: "a", valid: false },
    { value: " ", dependentValue: " ", valid: true },
    { value: "a", dependentValue: " ", valid: true },
    { value: " ", dependentValue: "a", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and dependentValue is '$dependentValue'",
    ({ value, dependentValue, valid }) => {
      expect(validateForbiddenIf({ value, dependentValue })).toBe(valid);
    }
  );
});
