import { validateEmail } from "~/domain/validation/validateEmail";

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
      expect(validateEmail({ value })).toBe(valid);
    }
  );
});
