import { validateHausnummer } from "~/domain/validation/validateHausnummer";

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
      expect(validateHausnummer({ value })).toBe(valid);
    }
  );
});
