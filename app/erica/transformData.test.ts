import { grundModelFactory } from "test/factories";
import {
  calculateGroesse,
  transforDataToEricaFormat,
} from "~/erica/transformData";

describe("transforDataToEricaFormat", () => {
  describe("no data", function () {
    it("should return empty object", () => {
      const result = transforDataToEricaFormat({});
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe("full grundstueck data", function () {
    it("should move object keys to correct place", () => {
      const inputFlurstuecke = [
        {
          angaben: {
            grundbuchblattnummer: "1",
            gemarkung: "2",
          },
          flur: {
            flur: "Test1",
            flurstueckZaehler: "23",
            flurstueckNenner: "45",
            wirtschaftlicheEinheitZaehler: "67",
            wirtschaftlicheEinheitNenner: "89",
          },
          groesse: {
            groesseHa: "",
            groesseA: "",
            groesseQm: "1234",
          },
        },
        {
          angaben: {
            grundbuchblattnummer: "2",
            gemarkung: "3",
          },
          flur: {
            flur: "Test2",
            flurstueckZaehler: "34",
            flurstueckNenner: "56",
            wirtschaftlicheEinheitZaehler: "78",
            wirtschaftlicheEinheitNenner: "90",
          },
          groesse: {
            groesseHa: "",
            groesseA: "123",
            groesseQm: "45",
          },
        },
      ];
      const inputData = grundModelFactory
        .grundstueckTyp({ typ: "einfamilienhaus" })
        .grundstueckAdresse({ bundesland: "BB" })
        .grundstueckSteuernummer({ steuernummer: "1234567890" })
        .grundstueckAbweichendeEntwicklung({ zustand: "rohbauland" })
        .grundstueckGemeinde({ innerhalbEinerGemeinde: "true" })
        .grundstueckBodenrichtwert({ bodenrichtwert: "123" })
        .grundstueckFlurstueck({ list: inputFlurstuecke, count: 2 })
        .build();
      const expectedData = {
        grundstueck: {
          typ: "einfamilienhaus",
          adresse: {
            ...inputData.grundstueck?.adresse,
            bundesland: "BB",
          },
          steuernummer: "1234567890",
          abweichendeEntwicklung: "rohbauland",
          innerhalbEinerGemeinde: "true",
          bodenrichtwert: "123",
          flurstueck: [
            {
              angaben: inputFlurstuecke[0].angaben,
              flur: inputFlurstuecke[0].flur,
              groesseQm: "1234",
            },
            {
              angaben: inputFlurstuecke[1].angaben,
              flur: inputFlurstuecke[1].flur,
              groesseQm: "12345",
            },
          ],
        },
      };

      const result = transforDataToEricaFormat(inputData);

      expect(result).toEqual(expectedData);
    });
  });

  describe("flurstueck groesse", function () {
    const defaultFlurstueck = {
      angaben: {
        grundbuchblattnummer: "1",
        gemarkung: "2",
      },
      flur: {
        flur: "Test1",
        flurstueckZaehler: "23",
        flurstueckNenner: "45",
        wirtschaftlicheEinheitZaehler: "67",
        wirtschaftlicheEinheitNenner: "89",
      },
      groesse: {
        groesseHa: "",
        groesseA: "",
        groesseQm: "",
      },
    };

    it("should set groesse correctly if only qm given", () => {
      defaultFlurstueck.groesse.groesseHa = "";
      defaultFlurstueck.groesse.groesseA = "";
      defaultFlurstueck.groesse.groesseQm = "123";
      const inputData = grundModelFactory
        .grundstueckFlurstueck({ list: [defaultFlurstueck], count: 2 })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.grundstueck.flurstueck[0].groesseQm).toEqual("123");
    });

    it("should set groesse correctly if all fields given", () => {
      defaultFlurstueck.groesse.groesseHa = "1";
      defaultFlurstueck.groesse.groesseA = "2";
      defaultFlurstueck.groesse.groesseQm = "3";
      const inputData = grundModelFactory
        .grundstueckFlurstueck({ list: [defaultFlurstueck], count: 2 })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.grundstueck.flurstueck[0].groesseQm).toEqual("10203");
    });
  });
});

describe("calculateGroesse", () => {
  const cases = [
    { groesseHa: "", groesseA: "", groesseQm: "123", result: "123" },
    { groesseHa: "", groesseA: "1", groesseQm: "23", result: "123" },
    { groesseHa: "", groesseA: "1", groesseQm: "2", result: "102" },
    { groesseHa: "1", groesseA: "2", groesseQm: "3", result: "10203" },
    { groesseHa: "", groesseA: "123", groesseQm: "45", result: "12345" },
    { groesseHa: "", groesseA: "", groesseQm: "05", result: "5" },
    { groesseHa: "0", groesseA: "0", groesseQm: "5", result: "5" },
    { groesseHa: "1", groesseA: "", groesseQm: "", result: "10000" },
  ];

  test.each(cases)(
    "Should return $result if values are '$groesseHa', '$groesseA', and '$groesseQm'",
    ({ groesseHa, groesseA, groesseQm, result }) => {
      expect(calculateGroesse({ groesseHa, groesseA, groesseQm })).toEqual(
        result
      );
    }
  );

  const errorCases = [
    { groesseHa: "", groesseA: "", groesseQm: "0" },
    { groesseHa: "", groesseA: "1", groesseQm: "123" },
    { groesseHa: "1", groesseA: "", groesseQm: "123" },
  ];

  test.each(errorCases)(
    "Should throw error if values are '$groesseHa', '$groesseA', and '$groesseQm'",
    ({ groesseHa, groesseA, groesseQm }) => {
      expect(() =>
        calculateGroesse({ groesseHa, groesseA, groesseQm })
      ).toThrow();
    }
  );
});
