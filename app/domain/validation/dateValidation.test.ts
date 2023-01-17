import {
  validateDateInPast,
  validateIsDate,
  validateYearAfterBaujahr,
  validateYearInFutureOfVeranlagungszeitraum,
  validateYearInPastOfVeranlagungszeitraum,
} from "~/domain/validation/dateValidation";
import { grundModelFactory } from "test/factories";

describe("validateIsDate", () => {
  const cases = [
    { value: "1", valid: false },
    { value: "", valid: true },
    { value: " 12.06.2020 ", valid: true },
    { value: "12.06.2020", valid: true },
    { value: "12.06.2020.20", valid: false },
    { value: "2.6.2020", valid: false }, // sad.
    { value: "12/06/2020", valid: false },
    { value: "12.06.20", valid: false },
    { value: "12.06.2020e", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateIsDate({ value })).toBe(valid);
    }
  );
});

describe("validateYearAfterBaujahr", () => {
  const cases = [
    { value: "", baujahr: undefined, ab1949: true, valid: true },
    { value: "", baujahr: "2021", ab1949: true, valid: true },
    { value: "2022", baujahr: "2021", ab1949: true, valid: true },
    { value: "2022", baujahr: "2022", ab1949: true, valid: true },
    { value: "2022", baujahr: "2023", ab1949: true, valid: false },
    { value: "", baujahr: undefined, ab1949: false, valid: true },
    { value: "", baujahr: "2021", ab1949: false, valid: true },
    { value: "2022", baujahr: "2021", ab1949: false, valid: true },
    { value: "2022", baujahr: "2022", ab1949: false, valid: true },
    { value: "2022", baujahr: "2023", ab1949: false, valid: true },
    { value: "", baujahr: undefined, ab1949: undefined, valid: true },
    { value: "", baujahr: "2021", ab1949: undefined, valid: true },
    { value: "2022", baujahr: "2021", ab1949: undefined, valid: true },
    { value: "2022", baujahr: "2022", ab1949: undefined, valid: true },
    { value: "2022", baujahr: "2023", ab1949: undefined, valid: true },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value', baujahr is '$baujahr' and ab1949 is '$ab1949'",
    ({ value, baujahr, ab1949, valid }) => {
      const valueAb1949 = (
        ab1949 == undefined ? undefined : JSON.stringify(ab1949)
      ) as "true" | "false" | undefined;
      const allData = grundModelFactory
        .gebaeudeBaujahr({ baujahr: baujahr })
        .gebaeudeAb1949({ isAb1949: valueAb1949 })
        .build();
      expect(validateYearAfterBaujahr({ value, allData })).toBe(valid);
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
        expect(validateYearInFutureOfVeranlagungszeitraum({ value })).toBe(
          valid
        );
      } finally {
        Date.now = actualNowImplementation;
      }
    }
  );
});

describe("validateYearInPast", () => {
  const cases = [
    {
      value: "",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: undefined,
      valid: true,
    },
    {
      value: "2021",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: undefined,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: undefined,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingVeranlagungszeitraum: undefined,
      valid: true,
    },
    {
      value: "2023",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: undefined,
      valid: false,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: false,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingVeranlagungszeitraum: false,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingVeranlagungszeitraum: true,
      valid: false,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingVeranlagungszeitraum: true,
      valid: false,
    },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value', current date is '$currentDate' and exclude current year '$excludingVeranlagungszeitraum",
    ({ value, currentDate, excludingVeranlagungszeitraum, valid }) => {
      const actualNowImplementation = Date.now;
      try {
        Date.now = jest.fn(() => new Date(currentDate).valueOf());
        expect(
          validateYearInPastOfVeranlagungszeitraum({
            value,
            excludingVeranlagungszeitraum: excludingVeranlagungszeitraum,
          })
        ).toBe(valid);
      } finally {
        Date.now = actualNowImplementation;
      }
    }
  );
});

describe("validateDateInPast", () => {
  const cases = [
    {
      value: "01.01.2021",
      currentDate: Date.UTC(2022, 0, 1),
      valid: true,
    },
    {
      value: "31.12.2021",
      currentDate: Date.UTC(2022, 0, 1),
      valid: true,
    },
    {
      value: "01.01.2022",
      currentDate: Date.UTC(2022, 0, 1),
      valid: true,
    },
    {
      value: "01.01.2023",
      currentDate: Date.UTC(2022, 0, 1),
      valid: false,
    },
    {
      value: "",
      currentDate: Date.UTC(2022, 0, 1),
      valid: true,
    },
    {
      value: "01.01.20", // invalid format
      currentDate: Date.UTC(2022, 0, 1),
      valid: true,
    },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and current date is '$currentDate'",
    ({ value, currentDate, valid }) => {
      const actualNowImplementation = Date.now;
      try {
        Date.now = jest.fn(() => new Date(currentDate).valueOf());
        expect(validateDateInPast({ value })).toBe(valid);
      } finally {
        Date.now = actualNowImplementation;
      }
    }
  );
});
