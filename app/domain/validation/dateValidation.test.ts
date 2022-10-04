import {
  validateDateInPast,
  validateIsDate,
  validateYearAfterBaujahr,
  validateYearInFuture,
  validateYearInPast,
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
    { value: "", baujahr: undefined, valid: true },
    { value: "", baujahr: "2021", valid: true },
    { value: "2022", baujahr: "2021", valid: true },
    { value: "2022", baujahr: "2022", valid: true },
    { value: "2022", baujahr: "2023", valid: false },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value' and baujahr is '$baujahr'",
    ({ value, baujahr, valid }) => {
      const allData = grundModelFactory
        .gebaeudeBaujahr({ baujahr: baujahr })
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
        expect(validateYearInFuture({ value })).toBe(valid);
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
      excludingCurrentYear: undefined,
      valid: true,
    },
    {
      value: "2021",
      currentDate: Date.UTC(2022, 0, 1),
      excludingCurrentYear: undefined,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingCurrentYear: undefined,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingCurrentYear: undefined,
      valid: true,
    },
    {
      value: "2023",
      currentDate: Date.UTC(2022, 0, 1),
      excludingCurrentYear: undefined,
      valid: false,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingCurrentYear: false,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingCurrentYear: false,
      valid: true,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 0, 1),
      excludingCurrentYear: true,
      valid: false,
    },
    {
      value: "2022",
      currentDate: Date.UTC(2022, 11, 31),
      excludingCurrentYear: true,
      valid: false,
    },
  ];

  test.each(cases)(
    "Should return $valid if value is '$value', current date is '$currentDate' and exclude current year '$excludingCurrentYear",
    ({ value, currentDate, excludingCurrentYear, valid }) => {
      const actualNowImplementation = Date.now;
      try {
        Date.now = jest.fn(() => new Date(currentDate).valueOf());
        expect(validateYearInPast({ value, excludingCurrentYear })).toBe(valid);
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
