import {
  validateSteuerId,
  validateUniqueSteuerId,
} from "~/domain/validation/steuerIdValidation";
import { grundModelFactory } from "test/factories";

describe("validateSteuerId", () => {
  const cases = [
    { value: "34285296716", valid: true }, // Valid IdNr
    { value: " 34 285 296 716 ", valid: true }, // Valid IdNr with spaces
    { value: "04452397687", valid: true }, // Valid Test IdNr
    { value: "04 452 397 687", valid: true }, // Valid Test IdNr with spaces
    { value: "34285296719", valid: false }, // Invalid IdNr
    { value: "A4452397687", valid: false }, // With letters
    { value: "1234567890", valid: false }, // Too short
    { value: "123456789012", valid: false }, // Too long
    { value: "04444397687", valid: false }, // Repeated 4 too often
    { value: "04152397687", valid: false }, // No repetition
    { value: "04455397687", valid: false }, // Too many repetitions
    { value: "04452397680", valid: true }, // Wrong checksum TODO: no checksum implementation yet
  ];

  test.each(cases)(
    "Should return $valid if value is '$value'",
    ({ value, valid }) => {
      expect(validateSteuerId({ value })).toBe(valid);
    }
  );
});

describe("validateUniqueSteuerId", () => {
  const steuerId1 = {
    steuerId: {
      steuerId: "11 111 111 111",
    },
  };
  const steuerId2 = {
    steuerId: {
      steuerId: "22 222 222 222",
    },
  };
  const cases = [
    { id: "1", allData: {}, value: undefined, valid: true },
    {
      id: "2",
      allData: grundModelFactory.eigentuemerPerson({ list: [{}] }).build(),
      value: undefined,
      valid: true,
    },
    {
      id: "3",
      allData: grundModelFactory.eigentuemerPerson({ list: [{}] }).build(),
      value: steuerId1.steuerId.steuerId,
      valid: true,
    },
    {
      id: "4",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1] })
        .build(),
      value: undefined,

      valid: true,
    },
    {
      id: "5",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1] })
        .build(),
      value: steuerId2.steuerId.steuerId,
      valid: true,
    },
    {
      id: "6",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1] })
        .build(),
      value: steuerId1.steuerId.steuerId,
      valid: false,
    },
    {
      id: "7",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1] })
        .build(),
      value: steuerId1.steuerId.steuerId,
      noNewDataAdded: true,
      valid: true,
    },
    {
      id: "8",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1, steuerId2] })
        .build(),
      value: undefined,
      valid: true,
    },
    {
      id: "9",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1] })
        .build(),
      value: steuerId1.steuerId.steuerId,
      valid: false,
    },

    {
      id: "10",
      allData: grundModelFactory
        .eigentuemerPerson({ list: [steuerId1, steuerId1] })
        .build(),
      value: undefined,
      noNewDataAdded: true,
      valid: false,
    },
    {
      id: "11",
      allData: { eigentuemer: {} },
      value: undefined,
      valid: true,
    },
  ];

  test.each(cases)(
    "Should return $valid if allData is '$allData' - id: '$id'",
    ({ allData, value, noNewDataAdded, valid }) => {
      expect(validateUniqueSteuerId({ allData, value, noNewDataAdded })).toBe(
        valid
      );
    }
  );
});
