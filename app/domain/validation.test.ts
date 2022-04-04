import {
  validateEmail,
  validateFloat,
  validateGrundbuchblattnummer,
  validateHausnummer,
  validateMaxLength,
  validateMaxLengthFloat,
  validateMinLength,
  validateNoZero,
  validateOnlyDecimal,
  validateRequired,
  validateRequiredIf,
  validateRequiredIfCondition,
  validateYearInFuture,
  validateYearInPast,
} from "./validation";
import { GrundModel } from "~/domain/steps";

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

describe("validateOnlyDecimal", () => {
  const cases = [
    { value: "1", valid: true },
    { value: "  1  ", valid: true },
    { value: "01", valid: true },
    { value: "", valid: true },
    { value: undefined, valid: true },
    { value: "1e", valid: false },
    { value: "text", valid: false },
    { value: "0,9", valid: false },
    { value: "0.9", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateOnlyDecimal(value)).toBe(valid);
    }
  );
});

describe("validateNoZero", () => {
  const cases = [
    { value: "0", valid: false },
    { value: 0, valid: false },
    { value: " 1  ", valid: true },
    { value: "01", valid: true },
    { value: "", valid: true },
    { value: undefined, valid: true },
    { value: "1e", valid: true },
    { value: "text", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateNoZero(value)).toBe(valid);
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
    { value: "1234,9876", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateFloat(value)).toBe(valid);
    }
  );
});

describe("validateMaxLengthFloat", () => {
  const cases = [
    { value: "0", preComma: 1, postComma: 2, valid: true },
    { value: "2", preComma: 1, postComma: 2, valid: true },
    { value: "1,12", preComma: 1, postComma: 2, valid: true },
    { value: "12", preComma: 1, postComma: 2, valid: false },
    { value: "1,123", preComma: 1, postComma: 2, valid: false },
    { value: "12,123", preComma: 1, postComma: 2, valid: false },
    { value: "12,123", preComma: 2, postComma: 3, valid: true },
    { value: "1,12", preComma: 2, postComma: 3, valid: true },
    { value: "", preComma: 1, postComma: 2, valid: true },
    { value: undefined, preComma: 1, postComma: 2, valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value', preComma is $preComma, postComma is $postComma",
    ({ value, valid, preComma, postComma }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateMaxLengthFloat(value, preComma, postComma)).toBe(valid);
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

      expect(validateRequiredIfCondition(value, condition, allData)).toBe(
        valid
      );

      expect(condition.mock.calls.length).toBe(1);
      expect(condition.mock.calls[0].length).toBe(1); // one argument
      expect((condition.mock.calls[0] as Array<object>)[0]).toEqual(allData); // correct argument
    }
  );
});

describe("validateHausnummer", () => {
  const cases = [
    { value: "", valid: true },
    { value: "42", valid: true },
    { value: "0", valid: true },
    { value: "04", valid: true },
    { value: "123456", valid: true },
    { value: "1b", valid: true },
    { value: "1234abcdefghij", valid: true },
    { value: "1234abcdefghijk", valid: false }, // too long
    { value: "123abcdefghijk", valid: false }, // too few numbers
    { value: "0123abcdefghij", valid: true },
    { value: "haus", valid: false }, // starts with letter
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateHausnummer(value)).toBe(valid);
    }
  );
});

describe("validateGrundbuchblattnummer", () => {
  const cases = [
    { value: "", valid: true },
    { value: "42", valid: true },
    { value: "0", valid: true },
    { value: "04", valid: true },
    { value: "12345", valid: true },
    { value: "123456", valid: true },
    { value: "1b", valid: true },
    { value: "12345A", valid: true },
    { value: "12345Ab", valid: false }, // too long
    { value: "123456A", valid: false }, // too long
    { value: "1234Ab", valid: false }, // letter in wrong place
    { value: "h", valid: false }, // starts with letter
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateGrundbuchblattnummer(value)).toBe(valid);
    }
  );
});

describe("validateYearInFuture", () => {
  const cases = [
    { value: "", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2023", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2022", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2021", currentDate: Date.UTC(2022, 0, 1), valid: false },
    { value: "2022", currentDate: Date.UTC(2022, 11, 31), valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and current date is $currentDate",
    ({ value, currentDate, valid }) => {
      const actualNowImplementation = Date.now;
      try {
        Date.now = jest.fn(() => new Date(currentDate).valueOf());
        expect(validateYearInFuture(value)).toBe(valid);
      } finally {
        Date.now = actualNowImplementation;
      }
    }
  );
});

describe("validateYearInPast", () => {
  const cases = [
    { value: "", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2021", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2022", currentDate: Date.UTC(2022, 0, 1), valid: true },
    { value: "2023", currentDate: Date.UTC(2022, 0, 1), valid: false },
    { value: "2022", currentDate: Date.UTC(2022, 11, 31), valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and current date is $currentDate",
    ({ value, currentDate, valid }) => {
      const actualNowImplementation = Date.now;
      try {
        Date.now = jest.fn(() => new Date(currentDate).valueOf());
        expect(validateYearInPast(value)).toBe(valid);
      } finally {
        Date.now = actualNowImplementation;
      }
    }
  );
});
