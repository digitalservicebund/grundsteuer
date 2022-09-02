import {
  validateMaxLength,
  validateMaxLengthFloat,
  validateMinLength,
} from "~/domain/validation/stringValidation";

describe("validateMaxLength", () => {
  const cases = [
    { value: "", maxLength: 1, exceptions: undefined, valid: true },
    { value: "a", maxLength: 1, exceptions: undefined, valid: true },
    { value: "  aa  ", maxLength: 2, exceptions: undefined, valid: true },
    { value: "aa", maxLength: 1, exceptions: undefined, valid: false },
    { value: "a a", maxLength: 2, exceptions: undefined, valid: false },
    { value: "a a", maxLength: 2, exceptions: [" "], valid: true },
    { value: "a  a", maxLength: 2, exceptions: [" "], valid: true },
    { value: "a \\a", maxLength: 2, exceptions: [" "], valid: false },
    { value: "a \\a", maxLength: 2, exceptions: [" ", "\\"], valid: true },
  ];

  test.each(cases)(
    "Should return $valid if maxLength is $maxLength and value is '$value'",
    ({ value, maxLength, exceptions, valid }) => {
      expect(validateMaxLength({ value, maxLength, exceptions })).toBe(valid);
    }
  );
});

describe("validateMinLength", () => {
  const cases = [
    { value: "a", minLength: 1, exceptions: undefined, valid: true },
    { value: "aa", minLength: 1, exceptions: undefined, valid: true },
    { value: "  ", minLength: 1, exceptions: undefined, valid: false },
    { value: "a", minLength: 2, exceptions: undefined, valid: false },
    { value: "abc", minLength: 3, exceptions: undefined, valid: true },
    { value: "a b", minLength: 3, exceptions: [" "], valid: false },
    { value: "a  b", minLength: 3, exceptions: [" "], valid: false },
    { value: "a \\b", minLength: 3, exceptions: [" ", "\\"], valid: false },
    { value: "a \\bc", minLength: 3, exceptions: [" ", "\\"], valid: true },
  ];

  test.each(cases)(
    "Should return $valid if minLength is $minLength and value is '$value'",
    ({ value, minLength, exceptions, valid }) => {
      expect(validateMinLength({ value, minLength, exceptions })).toBe(valid);
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
      expect(validateMaxLengthFloat({ value, preComma, postComma })).toBe(
        valid
      );
    }
  );
});
