import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseLength,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation/flurstueckValidation";

describe("validateFlurstueckGroesse", () => {
  const cases = [
    { valueHa: "1", valueA: "0", valueQm: "", valid: true },
    { valueHa: "0", valueA: "01", valueQm: "0", valid: true },
    { valueHa: "0", valueA: "0", valueQm: "123", valid: true },
    { valueHa: "", valueA: "1", valueQm: "12", valid: true },
    { valueHa: "", valueA: "1", valueQm: "123", valid: false },
    { valueHa: "1", valueA: "", valueQm: "123", valid: false },
    { valueHa: "", valueA: "", valueQm: "123", valid: true },
    { valueHa: "0", valueA: "", valueQm: "123", valid: true },
    { valueHa: "", valueA: "0000", valueQm: "123", valid: true },
    { valueHa: "", valueA: "", valueQm: "0", valid: false },
    { valueHa: "0", valueA: "0", valueQm: "0", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if values are '$valueHa', '$valueA', and '$valueQm'",
    ({ valueHa, valueA, valueQm, valid }) => {
      expect(validateFlurstueckGroesse({ valueHa, valueA, valueQm })).toBe(
        valid
      );
    }
  );
});

describe("validateFlurstueckGroesseLength", () => {
  const cases = [
    { valueHa: "123456789", valueA: "", valueQm: "", valid: true },
    { valueHa: "1234567890", valueA: "", valueQm: "", valid: false },
    { valueHa: "", valueA: "", valueQm: "123456789", valid: true },
    { valueHa: "", valueA: "", valueQm: "1234567890", valid: false },
    { valueHa: "", valueA: "123456789", valueQm: "", valid: true },
    { valueHa: "", valueA: "1234567890", valueQm: "", valid: false },
    { valueHa: "12345", valueA: "678", valueQm: "9", valid: true },
    { valueHa: "12345", valueA: "678", valueQm: "90", valid: false },
    { valueHa: "12345", valueA: "678", valueQm: "091", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if values are '$valueHa', '$valueA', and '$valueQm'",
    ({ valueHa, valueA, valueQm, valid }) => {
      expect(
        validateFlurstueckGroesseLength({ valueHa, valueA, valueQm })
      ).toBe(valid);
    }
  );
});

describe("validateFlurstueckGroesseRequired", () => {
  const cases = [
    { valueHa: "", valueA: "", valueQm: "", valid: false },
    { valueHa: "", valueA: "", valueQm: "0", valid: false },
    { valueHa: "", valueA: "", valueQm: "00", valid: false },
    { valueHa: "", valueA: "", valueQm: "0 0", valid: false },
    { valueHa: "0", valueA: "0", valueQm: "0", valid: false },
    { valueHa: "", valueA: "", valueQm: "1", valid: true },
    { valueHa: "", valueA: "", valueQm: "a", valid: true },
    { valueHa: "", valueA: "1", valueQm: "", valid: true },
    { valueHa: "1", valueA: "", valueQm: "", valid: true },
  ];

  test.each(cases)(
    "Should return $valid if values are '$valueHa', '$valueA', and '$valueQm'",
    ({ valueHa, valueA, valueQm, valid }) => {
      expect(
        validateFlurstueckGroesseRequired({ valueHa, valueA, valueQm })
      ).toBe(valid);
    }
  );
});
