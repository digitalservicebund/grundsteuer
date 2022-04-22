import { grundModelFactory } from "test/factories";
import {
  calculateGroesse,
  separateHausnummerAndZusatz,
  transforDataToEricaFormat,
} from "~/erica/transformData";
import { Person } from "~/domain/steps";

describe("transforDataToEricaFormat", () => {
  const twoPersonList: Person[] = [
    {
      persoenlicheAngaben: {
        anrede: "frau",
        titel: "1 Titel",
        vorname: "1 Vorname",
        name: "1 Name",
        geburtsdatum: "01.01.1111",
      },
      adresse: {
        strasse: "1 Strasse",
        hausnummer: "1 Hausnummer",
        postfach: "1 Postfach",
        plz: "1 PLZ",
        ort: "1 Ort",
        telefonnummer: "111111",
      },
      steuerId: {
        steuerId: "1111",
      },
      gesetzlicherVertreter: {
        hasVertreter: "false",
      },
      anteil: {
        zaehler: "1",
        nenner: "2",
      },
    },
    {
      persoenlicheAngaben: {
        anrede: "herr",
        titel: "2 Titel",
        vorname: "2 Vorname",
        name: "2 Name",
        geburtsdatum: "02.02.2222",
      },
      adresse: {
        strasse: "2 Strasse",
        hausnummer: "2 Hausnummer",
        postfach: "2 Postfach",
        plz: "2 PLZ",
        ort: "2 Ort",
        telefonnummer: "222222",
      },
      steuerId: {
        steuerId: "2222",
      },
      gesetzlicherVertreter: {
        hasVertreter: "true",
      },
      vertreter: {
        name: {
          anrede: "herr",
          titel: "VERT Titel",
          vorname: "VERT Vorname",
          name: "VERT Name",
        },
        adresse: {
          strasse: "VERT Strasse",
          hausnummer: "3VERT",
          postfach: "VERT Postfach",
          plz: "VERT PLZ",
          ort: "VERT Ort",
          telefonnummer: "333333",
        },
      },
      anteil: {
        zaehler: "3",
        nenner: "4",
      },
    },
  ];

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
        .grundstueckAdresse({
          strasse: "GST Strasse",
          hausnummer: "2GST",
          zusatzangaben: "GST Zusatzangaben",
          plz: "GST PLZ",
          ort: "GST Ort",
          bundesland: "BB",
        })
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
            strasse: "GST Strasse",
            hausnummer: "2",
            hausnummerzusatz: "GST",
            zusatzangaben: "GST Zusatzangaben",
            plz: "GST PLZ",
            ort: "GST Ort",
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

  describe("full gebaeude data", function () {
    it("should move object keys to correct place", () => {
      const inputData = grundModelFactory
        .gebaeudeAb1949({ isAb1949: "true" })
        .gebaeudeBaujahr({ baujahr: "2000" })
        .kernsaniert({ isKernsaniert: "true", kernsanierungsjahr: "2001" })
        .abbruchverpflichtung({
          hasAbbruchverpflichtung: "true",
          abbruchverpflichtungsjahr: "2002",
        })
        .wohnflaechen({ wohnflaeche: "100" })
        .withWeitereWohnraeume({
          hasWeitereWohnraeume: "true",
          anzahl: "2",
          flaeche: "200",
        })
        .withGaragen({ hasGaragen: "true", anzahlGaragen: "3" })
        .build();
      const expectedData = {
        gebaeude: {
          ab1949: {
            isAb1949: "true",
          },
          baujahr: {
            baujahr: "2000",
          },
          kernsaniert: {
            isKernsaniert: "true",
          },
          kernsanierungsjahr: {
            kernsanierungsjahr: "2001",
          },
          abbruchverpflichtung: {
            hasAbbruchverpflichtung: "true",
          },
          abbruchverpflichtungsjahr: {
            abbruchverpflichtungsjahr: "2002",
          },
          wohnflaechen: ["100"],
          weitereWohnraeume: {
            hasWeitereWohnraeume: "true",
          },
          weitereWohnraeumeDetails: {
            anzahl: "2",
            flaeche: "200",
          },
          garagen: {
            hasGaragen: "true",
          },
          garagenAnzahl: {
            anzahlGaragen: "3",
          },
        },
      };

      const result = transforDataToEricaFormat(inputData);

      expect(result).toEqual(expectedData);
    });
  });

  describe("full eigentuemer data", () => {
    it("should move object keys to correct place", () => {
      const inputData = grundModelFactory
        .eigentuemerVerheiratet({ areVerheiratet: "false" })
        .eigentuemerPerson({
          list: twoPersonList,
        })
        .eigentuemerBruchteilsgemeinschaft({
          predefinedData: "false",
          name: "BTG Name",
          strasse: "BTG Strasse",
          hausnummer: "1BTG",
          postfach: "BTG Postfach",
          plz: "BTG PLZ",
          ort: "BTG Ort",
        })
        .eigentuemerEmpfangsvollmacht({
          hasEmpfangsvollmacht: "true",
          anrede: "no_anrede",
          titel: "EMP Titel",
          vorname: "EMP Vorname",
          name: "EMP Name",
          strasse: "EMP Strasse",
          hausnummer: "2EMP",
          postfach: "EMP Postfach",
          plz: "EMP PLZ",
          ort: "EMP Ort",
          telefonnummer: "12345",
        })
        .build();

      const expectedData = {
        eigentuemer: {
          person: [
            {
              persoenlicheAngaben: {
                anrede: "frau",
                titel: "1 Titel",
                vorname: "1 Vorname",
                name: "1 Name",
                geburtsdatum: "01.01.1111",
              },
              adresse: {
                strasse: "1 Strasse",
                hausnummer: "1",
                hausnummerzusatz: " Hausnummer",
                postfach: "1 Postfach",
                plz: "1 PLZ",
                ort: "1 Ort",
              },
              telefonnummer: {
                telefonnummer: "111111",
              },
              steuerId: {
                steuerId: "1111",
              },
              anteil: {
                zaehler: "1",
                nenner: "2",
              },
            },
            {
              persoenlicheAngaben: {
                anrede: "herr",
                titel: "2 Titel",
                vorname: "2 Vorname",
                name: "2 Name",
                geburtsdatum: "02.02.2222",
              },
              adresse: {
                strasse: "2 Strasse",
                hausnummer: "2",
                hausnummerzusatz: " Hausnummer",
                postfach: "2 Postfach",
                plz: "2 PLZ",
                ort: "2 Ort",
              },
              telefonnummer: {
                telefonnummer: "222222",
              },
              steuerId: {
                steuerId: "2222",
              },
              vertreter: {
                name: {
                  anrede: "herr",
                  titel: "VERT Titel",
                  vorname: "VERT Vorname",
                  name: "VERT Name",
                },
                adresse: {
                  strasse: "VERT Strasse",
                  hausnummer: "3",
                  hausnummerzusatz: "VERT",
                  postfach: "VERT Postfach",
                  plz: "VERT PLZ",
                  ort: "VERT Ort",
                },
                telefonnummer: {
                  telefonnummer: "333333",
                },
              },
              anteil: {
                zaehler: "3",
                nenner: "4",
              },
            },
          ],
          verheiratet: {
            areVerheiratet: "false",
          },
          bruchteilsgemeinschaft: {
            name: "BTG Name",
            adresse: {
              strasse: "BTG Strasse",
              hausnummer: "1",
              hausnummerzusatz: "BTG",
              postfach: "BTG Postfach",
              plz: "BTG PLZ",
              ort: "BTG Ort",
            },
          },
          empfangsbevollmaechtigter: {
            name: {
              anrede: "no_anrede",
              titel: "EMP Titel",
              vorname: "EMP Vorname",
              name: "EMP Name",
            },
            adresse: {
              strasse: "EMP Strasse",
              hausnummer: "2",
              hausnummerzusatz: "EMP",
              postfach: "EMP Postfach",
              plz: "EMP PLZ",
              ort: "EMP Ort",
            },
            telefonnummer: {
              telefonnummer: "12345",
            },
          },
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

  describe("wohnflaechen", () => {
    it("should set wohnflaechen correctly if single wohnflaeche given", () => {
      const inputData = grundModelFactory
        .wohnflaechen({ wohnflaeche: "10" })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.gebaeude.wohnflaechen).toEqual(["10"]);
    });

    it("should set wohnflaechen correctly if two wohnflaechen given", () => {
      const inputData = grundModelFactory
        .wohnflaechen({ wohnflaeche1: "10", wohnflaeche2: "20" })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.gebaeude.wohnflaechen).toEqual(["10", "20"]);
    });
  });

  describe("transformBruchteilsgemeinschaft", () => {
    it("should set bruchteilsgeeinschaft correctly if predefined data chosen", () => {
      const inputData = grundModelFactory
        .eigentuemerBruchteilsgemeinschaft({
          predefinedData: "true",
          name: "BTG Name",
          strasse: "BTG Strasse",
          hausnummer: "1BTG",
          postfach: "BTG Postfach",
          plz: "BTG PLZ",
          ort: "BTG Ort",
        })
        .eigentuemerPerson({ list: twoPersonList })
        .grundstueckAdresse({
          strasse: "GST Strasse",
          hausnummer: "2GST",
          zusatzangaben: "GST Zusatzangaben",
          plz: "GST PLZ",
          ort: "GST Ort",
        })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.eigentuemer.bruchteilsgemeinschaft).toEqual({
        name: "Bruchteilsgem. 1 Strasse 1 Hausnummer",
        adresse: {
          strasse: "GST Strasse",
          hausnummer: "2",
          hausnummerzusatz: "GST",
          plz: "GST PLZ",
          ort: "GST Ort",
        },
      });
    });

    it("should set bruchteilsgemeinschaft correctly if predefined data not chosen", () => {
      const inputData = grundModelFactory
        .eigentuemerBruchteilsgemeinschaft({
          predefinedData: "false",
          name: "BTG Name",
          strasse: "BTG Strasse",
          hausnummer: "1BTG",
          postfach: "BTG Postfach",
          plz: "BTG PLZ",
          ort: "BTG Ort",
        })
        .eigentuemerPerson({ list: twoPersonList })
        .grundstueckAdresse({
          strasse: "GST Strasse",
          hausnummer: "2GST",
          zusatzangaben: "GST Zusatzangaben",
          plz: "GST PLZ",
          ort: "GST Ort",
        })
        .build();

      const result = transforDataToEricaFormat(inputData);

      expect(result.eigentuemer.bruchteilsgemeinschaft).toEqual({
        name: "BTG Name",
        adresse: {
          strasse: "BTG Strasse",
          hausnummer: "1",
          hausnummerzusatz: "BTG",
          postfach: "BTG Postfach",
          plz: "BTG PLZ",
          ort: "BTG Ort",
        },
      });
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

describe("separateHausnummerAndZusatz", () => {
  const cases = [
    { input: "1", expectedHausnummer: "1", expectedZusatz: "" },
    { input: "1c", expectedHausnummer: "1", expectedZusatz: "c" },
    { input: "01c", expectedHausnummer: "01", expectedZusatz: "c" },
    { input: "c", expectedHausnummer: "", expectedZusatz: "c" },
    { input: "12345", expectedHausnummer: "1234", expectedZusatz: "5" },
    { input: "14-18", expectedHausnummer: "14", expectedZusatz: "-18" },
    { input: "", expectedHausnummer: undefined, expectedZusatz: undefined },
  ];

  test.each(cases)(
    "Should return hausnummer '$expectedHausnummer' and zusatz '$expectedZusatz' if input is '$input'",
    ({ input, expectedHausnummer, expectedZusatz }) => {
      expect(separateHausnummerAndZusatz(input)).toEqual({
        hausnummer: expectedHausnummer,
        hausnummerzusatz: expectedZusatz,
      });
    }
  );
});
