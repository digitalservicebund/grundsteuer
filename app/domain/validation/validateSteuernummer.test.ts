import { grundModelFactory } from "test/factories";
import { validateSteuernummer } from "~/domain/validation/validateSteuernummer";
import { Bundesland } from "~/domain/steps/index.server";

describe("validate steuernummer/aktenzeichen", () => {
  describe("BE", () => {
    const allData = grundModelFactory
      .grundstueckAdresse({ bundesland: "BE" })
      .build();
    const validFANumbers = [
      13, 14, 16, 17, 18, 19, 21, 23, 24, 25, 31, 32, 33, 34, 35, 36,
    ];
    const validFACases = validFANumbers.map((faNumber) => {
      return {
        value: `${faNumber}/789/01234`,
        valid: true,
        msg: `valid steuernummer with valid FA number ${faNumber}`,
      };
    });

    const invalidFaNumbers = [];
    for (let i = 10; i <= 50; i++) {
      if (!validFANumbers.includes(i)) {
        invalidFaNumbers.push(i);
      }
    }
    const invalidFACases = invalidFaNumbers.map((faNumber) => {
      return {
        value: `${faNumber}/789/01234`,
        valid: false,
        msg: `invalid FA number ${faNumber}`,
      };
    });

    const invalid4thDigitCases = [0, 1, 2, 3, 4, 5, 6].map((digit) => {
      return {
        value: `14/${digit}89/01234`,
        valid: false,
        msg: `invalid 4th digit ${digit}`,
      };
    });

    const valid4thDigitCases = [7, 8, 9].map((digit) => {
      return {
        value: `13/${digit}00/01234`,
        valid: true,
        msg: `valid steuernummer with 4th digit ${digit}`,
      };
    });

    const cases = [
      ...validFACases,
      ...invalidFACases,
      ...invalid4thDigitCases,
      ...valid4thDigitCases,
      {
        value: "13/700/012345",
        valid: false,
        msg: "too long",
      },
      {
        value: "13/700/0123",
        valid: false,
        msg: "too short",
      },
    ];
    test.each(cases)(
      "Should return $valid if value is '$value' representing: $msg",
      ({ value, valid }) => {
        const result = validateSteuernummer({ value, allData });
        expect(result).toBe(valid);
      }
    );
  });

  describe("HB", () => {
    const allData = grundModelFactory
      .grundstueckAdresse({ bundesland: "HB" })
      .build();

    const validFANumbers = [57, 77];
    const invalidFANumbers = [];
    for (let i = 10; i <= 50; i++) {
      if (!validFANumbers.includes(i)) {
        invalidFANumbers.push(i);
      }
    }

    const validFACases = validFANumbers.map((faNumber) => {
      return {
        value: `${faNumber}/789/01234`,
        valid: true,
        msg: `valid steuernummer with valid FA number ${faNumber}`,
      };
    });

    const invalidFACases = invalidFANumbers.map((faNumber) => {
      return {
        value: `${faNumber}/789/01234`,
        valid: false,
        msg: `invalid FA number ${faNumber}`,
      };
    });

    const cases = [
      ...validFACases,
      ...invalidFACases,
      {
        value: "57/789/012345",
        valid: false,
        msg: "too long",
      },
      {
        value: "57/789/0123",
        valid: false,
        msg: "too short",
      },
    ];
    test.each(cases)(
      "Should return $valid if value is '$value' representing: $msg",
      ({ value, valid }) => {
        const result = validateSteuernummer({ value, allData });
        expect(result).toBe(valid);
      }
    );
  });

  describe("NW", () => {
    const allData = grundModelFactory
      .grundstueckAdresse({ bundesland: "NW" })
      .build();

    const invalid7thDigitCases = [0, 1, 2, 4, 5, 6, 7, 8, 9].map((digit) => {
      return {
        value: `123/456-${digit}-78901.2`,
        valid: false,
        msg: `invalid 7th digit ${digit}`,
      };
    });

    const cases = [
      ...invalid7thDigitCases,
      {
        value: "123/456-3-78901.23",
        valid: false,
        msg: "too long",
      },
      {
        value: "123/456-3-7890.2",
        valid: false,
        msg: "too short",
      },
      {
        value: "123/456-3-78901.2",
        valid: true,
        msg: "valid aktenzeichen",
      },
    ];
    test.each(cases)(
      "Should return $valid if value is '$value' representing: $msg",
      ({ value, valid }) => {
        const result = validateSteuernummer({ value, allData });
        expect(result).toBe(valid);
      }
    );
  });

  describe("SH", () => {
    const allData = grundModelFactory
      .grundstueckAdresse({ bundesland: "SH" })
      .build();

    const invalidFirstDigitCases = [0, 1, 2, 3, 4, 5, 6].map((digit) => {
      return {
        value: `${digit}0 123 45678`,
        valid: false,
        msg: `invalid 1st digit ${digit}`,
      };
    });

    const validFirstDigitCases = [7, 8, 9].map((digit) => {
      return {
        value: `${digit}0 123 45678`,
        valid: true,
        msg: `valid steuernummer with valid first digit ${digit}`,
      };
    });

    const cases = [
      ...validFirstDigitCases,
      ...invalidFirstDigitCases,
      {
        value: "70 123 456789",
        valid: false,
        msg: "too long",
      },
      {
        value: "70 123 4567",
        valid: false,
        msg: "too short",
      },
      {
        value: "70 123 45678",
        valid: true,
        msg: "valid steuernummer",
      },
    ];
    test.each(cases)(
      "Should return $valid if value is '$value' representing: $msg",
      ({ value, valid }) => {
        const result = validateSteuernummer({ value, allData });
        expect(result).toBe(valid);
      }
    );
  });

  ["BB", "MV", "RP", "SL", "SN", "ST", "TH"].forEach((bundesland) => {
    describe(`default bundesland ${bundesland}`, () => {
      const allData = grundModelFactory
        .grundstueckAdresse({ bundesland: bundesland as Bundesland })
        .build();

      const cases = [
        {
          value: "123/456/7890/987/654/32",
          valid: false,
          msg: "too long",
        },
        {
          value: "123/456/7890/987/65/3",
          valid: false,
          msg: "too short",
        },
        {
          value: "123/456/7890/987/654/3",
          valid: true,
          msg: "valid aktenzeichen",
        },
      ];
      test.each(cases)(
        "Should return $valid if value is '$value' representing: $msg",
        ({ value, valid }) => {
          const result = validateSteuernummer({ value, allData });
          expect(result).toBe(valid);
        }
      );
    });
  });
});
