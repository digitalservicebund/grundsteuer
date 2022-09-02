import { validateGrundbuchblattnummer } from "~/domain/validation/validateGrundbuchblattnummer";

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
      expect(validateGrundbuchblattnummer({ value })).toBe(valid);
    }
  );
});
