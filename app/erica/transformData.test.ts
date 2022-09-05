import { flurstueckFactory, grundModelFactory } from "test/factories";
import {
  calculateGroesse,
  fillPostCommaToLength,
  separateHausnummerAndZusatz,
  transformDataToEricaFormat,
  transformAnteil,
  transformDate,
  transformFlurstueck,
  transformBodenrichtwert,
  transformFreitext,
  transformFlurstuecke,
} from "~/erica/transformData";
import { Person } from "~/domain/steps/index.server";

describe("transformDataToEricaFormat", () => {
  const twoPersonList: Person[] = [
    {
      persoenlicheAngaben: {
        anrede: "frau",
        titel: "1 Titel",
        vorname: "1 Vorname",
        name: "1 Name",
        geburtsdatum: "31.01.1111",
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
        steuerId: "11 111 111 111",
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
      const result = transformDataToEricaFormat({});
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
            flur: "123",
            flurstueckZaehler: "23",
            flurstueckNenner: "45",
          },
          miteigentum: {
            wirtschaftlicheEinheitZaehler: "0067,1",
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
            flur: "222",
            flurstueckZaehler: "34",
            flurstueckNenner: "56",
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
        .grundstueckSteuernummer({ steuernummer: "123 456 7890" })
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
          bodenrichtwert: "123,00",
          flurstueck: [
            {
              angaben: inputFlurstuecke[0].angaben,
              flur: {
                flur: "123",
                flurstueckZaehler: "23",
                flurstueckNenner: "45",
                wirtschaftlicheEinheitZaehler: "67.1",
                wirtschaftlicheEinheitNenner: "89",
              },
              groesseQm: "1234",
            },
            {
              angaben: inputFlurstuecke[1].angaben,
              flur: {
                flur: "222",
                flurstueckZaehler: "34",
                flurstueckNenner: "56",
              },
              groesseQm: "12345",
            },
          ],
        },
      };

      const result = transformDataToEricaFormat(inputData);

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

      const result = transformDataToEricaFormat(inputData);

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
                geburtsdatum: "1111-01-31",
              },
              adresse: {
                strasse: "1 Strasse",
                hausnummer: "1",
                hausnummerzusatz: "Hausnummer",
                postfach: "1 Postfach",
                plz: "1 PLZ",
                ort: "1 Ort",
              },
              telefonnummer: "111111",
              steuerId: "11111111111",
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
                geburtsdatum: "2222-02-02",
              },
              adresse: {
                strasse: "2 Strasse",
                hausnummer: "2",
                hausnummerzusatz: "Hausnummer",
                postfach: "2 Postfach",
                plz: "2 PLZ",
                ort: "2 Ort",
              },
              telefonnummer: "222222",
              steuerId: "2222",
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
                telefonnummer: "333333",
              },
              anteil: {
                zaehler: "3",
                nenner: "4",
              },
            },
          ],
          verheiratet: "false",
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
            telefonnummer: "12345",
          },
        },
      };

      const result = transformDataToEricaFormat(inputData);

      expect(result).toEqual(expectedData);
    });
  });

  describe("freitext", () => {
    it("should set freitext as is if one bodenrichtwert and freitext given", () => {
      const inputData = grundModelFactory
        .grundstueckBodenrichtwert({ bodenrichtwert: "200" }, { anzahl: "1" })
        .freitext({ freitext: "Mehr Angaben" })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.freitext).toEqual("Mehr Angaben");
    });

    it("should not set freitext if one bodenrichtwert and no freitext given", () => {
      const inputData = grundModelFactory
        .grundstueckBodenrichtwert({ bodenrichtwert: "200" }, { anzahl: "1" })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.freitext).toEqual(undefined);
    });

    it("should set freitext with disclaimer if two bodenrichtwerte and freitext given", () => {
      const inputData = grundModelFactory
        .grundstueckBodenrichtwert({ bodenrichtwert: "200" }, { anzahl: "2" })
        .freitext({ freitext: "Mehr Angaben" })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.freitext).toEqual(
        "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück. Mehr Angaben"
      );
    });

    it("should set only disclaimer if two bodenrichtwerte and freitext not given", () => {
      const inputData = grundModelFactory
        .grundstueckBodenrichtwert({ bodenrichtwert: "200" }, { anzahl: "2" })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.freitext).toEqual(
        "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück."
      );
    });
  });

  describe("flurstueck groesse", function () {
    const defaultFlurstueck = {
      angaben: {
        grundbuchblattnummer: "1",
        gemarkung: "2",
      },
      flur: {
        flur: "123",
        flurstueckZaehler: "23",
        flurstueckNenner: "45",
        wirtschaftlicheEinheitZaehler: "67.0000",
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

      const result = transformDataToEricaFormat(inputData);

      expect(result.grundstueck.flurstueck[0].groesseQm).toEqual("123");
    });

    it("should set groesse correctly if all fields given", () => {
      defaultFlurstueck.groesse.groesseHa = "1";
      defaultFlurstueck.groesse.groesseA = "2";
      defaultFlurstueck.groesse.groesseQm = "3";
      const inputData = grundModelFactory
        .grundstueckFlurstueck({ list: [defaultFlurstueck], count: 2 })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.grundstueck.flurstueck[0].groesseQm).toEqual("10203");
    });
  });

  describe("wohnflaechen", () => {
    it("should set wohnflaechen correctly if single wohnflaeche given", () => {
      const inputData = grundModelFactory
        .wohnflaechen({ wohnflaeche: "10" })
        .build();

      const result = transformDataToEricaFormat(inputData);

      expect(result.gebaeude.wohnflaechen).toEqual(["10"]);
    });

    it("should set wohnflaechen correctly if two wohnflaechen given", () => {
      const inputData = grundModelFactory
        .wohnflaechen({ wohnflaeche1: "10", wohnflaeche2: "20" })
        .build();

      const result = transformDataToEricaFormat(inputData);

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

      const result = transformDataToEricaFormat(inputData);

      expect(result.eigentuemer.bruchteilsgemeinschaft).toEqual({
        name: "Bruchteilsgem. GST Strasse 2GST",
        adresse: {
          postfach: "1 Postfach",
          strasse: "1 Strasse",
          hausnummer: "1",
          hausnummerzusatz: "Hausnummer",
          plz: "1 PLZ",
          ort: "1 Ort",
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

      const result = transformDataToEricaFormat(inputData);

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

  it("should trim output", () => {
    const inputData = grundModelFactory
      .grundstueckAdresse({
        strasse: "     GST Strasse",
        hausnummer: " 02 GST ",
        zusatzangaben: " GST Zusatzangaben ",
        plz: "  GST PLZ",
        ort: "GST Ort     ",
      })
      .build();

    const result = transformDataToEricaFormat(inputData);

    expect(result.grundstueck.adresse).toEqual({
      strasse: "GST Strasse",
      hausnummer: "02",
      hausnummerzusatz: "GST",
      zusatzangaben: "GST Zusatzangaben",
      plz: "GST PLZ",
      ort: "GST Ort",
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
    { groesseHa: " ", groesseA: "  ", groesseQm: " 05 ", result: "5" },
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
    { input: " 1", expectedHausnummer: "1", expectedZusatz: "" },
    { input: "1c", expectedHausnummer: "1", expectedZusatz: "c" },
    { input: "01c", expectedHausnummer: "01", expectedZusatz: "c" },
    { input: "c", expectedHausnummer: "", expectedZusatz: "c" },
    { input: "12345", expectedHausnummer: "1234", expectedZusatz: "5" },
    { input: "14-18", expectedHausnummer: "14", expectedZusatz: "-18" },
    { input: " 1 c ", expectedHausnummer: "1", expectedZusatz: " c" },
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

describe("fillPostCommaToLength", () => {
  const cases = [
    { value: undefined, postCommaLength: 1, output: undefined },
    { value: "", postCommaLength: 1, output: "" },
    { value: "1", postCommaLength: 0, output: "1" },
    { value: "1,1", postCommaLength: 0, output: "1,1" },
    { value: "1", postCommaLength: 1, output: "1,0" },
    { value: "1,0", postCommaLength: 1, output: "1,0" },
    { value: "1,12", postCommaLength: 3, output: "1,120" },
    { value: "1,12", postCommaLength: 1, output: "1,12" },
    { value: " 1,12 ", postCommaLength: 3, output: "1,120" },
    { value: "1,12", postCommaLength: 2, output: "1,12" },
    { value: "1,1", postCommaLength: 2, output: "1,10" },
    { value: "1,", postCommaLength: 2, output: "1,00" },
    { value: "1", postCommaLength: 2, output: "1,00" },
  ];

  test.each(cases)(
    "Should return '$output' if value is '$value' and postCommaLength '$postCommaLength",
    ({ value, postCommaLength, output }) => {
      expect(fillPostCommaToLength(postCommaLength, value)).toEqual(output);
    }
  );
});

describe("transformAnteil", () => {
  const cases = [
    {
      anteil: { zaehler: "1", nenner: "2" },
      output: { zaehler: "1", nenner: "2" },
    },
    {
      anteil: { zaehler: "23", nenner: "45" },
      output: { zaehler: "23", nenner: "45" },
    },
    { anteil: undefined, output: { zaehler: "1", nenner: "1" } },
  ];

  test.each(cases)(
    "Should return '$output' if anteil is '$anteil'",
    ({ anteil, output }) => {
      expect(transformAnteil(anteil)).toEqual(output);
    }
  );
});

describe("transformBodenrichtwert", () => {
  const cases = [
    { input: "12", output: "12,00" },
    { input: "012", output: "12,00" },
    { input: " 012 ", output: "12,00" },
    { input: " 1,2 ", output: "1,20" },
    { input: " 1,23 ", output: "1,23" },
  ];

  test.each(cases)(
    "Should return '$output' if input is '$input'",
    ({ input, output }) => {
      expect(transformBodenrichtwert(input)).toEqual(output);
    }
  );
});

describe("transformDate", () => {
  const cases = [
    { date: "1.2.2020", output: "2020-2-1" },
    { date: "01.12.2020", output: "2020-12-01" },
    { date: " 01.12.2020 ", output: "2020-12-01" },
  ];

  test.each(cases)(
    "Should return '$output' if date is '$date'",
    ({ date, output }) => {
      expect(transformDate(date)).toEqual(output);
    }
  );
});

describe("transformFlurstuecke", () => {
  describe("with testFeaturesEnabled false", () => {
    it("no miteigentum", () => {
      const flurstueckeInput = [
        flurstueckFactory
          .angaben({ gemarkung: "Gemarkung", grundbuchblattnummer: "1" })
          .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
          .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
          .build(),
      ];

      const result = transformFlurstuecke(
        flurstueckeInput,
        undefined,
        undefined,
        undefined,
        false
      );

      expect(result).toEqual([
        {
          angaben: { gemarkung: "Gemarkung", grundbuchblattnummer: "1" },
          flur: {
            flur: "9",
            flurstueckZaehler: "2",
            flurstueckNenner: "3",
            wirtschaftlicheEinheitZaehler: undefined,
            wirtschaftlicheEinheitNenner: undefined,
          },
          groesseQm: "45",
        },
      ]);
    });

    it("with miteigentum", () => {
      const flurstueckeInput = [
        flurstueckFactory
          .angaben({ gemarkung: "Gemarkung", grundbuchblattnummer: "1" })
          .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
          .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
          .build(),
      ];
      const miteigentumsanteil = {
        wirtschaftlicheEinheitZaehler: "123",
        wirtschaftlicheEinheitNenner: "789",
      };

      const result = transformFlurstuecke(
        flurstueckeInput,
        miteigentumsanteil,
        undefined,
        undefined,
        false
      );

      expect(result).toEqual([
        {
          angaben: { gemarkung: "Gemarkung", grundbuchblattnummer: "1" },
          flur: {
            flur: "9",
            flurstueckZaehler: "2",
            flurstueckNenner: "3",
            wirtschaftlicheEinheitZaehler: "123",
            wirtschaftlicheEinheitNenner: "789",
          },
          groesseQm: "45",
        },
      ]);
    });
  });

  it("no miteigentum", () => {
    const flurstueckeInput = [
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung", grundbuchblattnummer: "1" })
        .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
        .build(),
    ];

    const result = transformFlurstuecke(
      flurstueckeInput,
      undefined,
      undefined,
      undefined,
      true
    );

    expect(result).toEqual([
      {
        angaben: { gemarkung: "Gemarkung", grundbuchblattnummer: "1" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: undefined,
          wirtschaftlicheEinheitNenner: undefined,
        },
        groesseQm: "45",
      },
    ]);
  });

  it("one miteigentum flurstueck", () => {
    const flurstueckeInput = [
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung", grundbuchblattnummer: "1" })
        .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
        .miteigentum({
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        })
        .build(),
    ];

    const result = transformFlurstuecke(
      flurstueckeInput,
      undefined,
      undefined,
      undefined,
      true
    );

    expect(result).toEqual([
      {
        angaben: { gemarkung: "Gemarkung", grundbuchblattnummer: "1" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "45",
      },
    ]);
  });

  it("multiple flurstuecke, one has miteigentum", () => {
    const flurstueckeInput = [
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung1", grundbuchblattnummer: "1" })
        .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
        .build(),
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung2", grundbuchblattnummer: "1" })
        .flur({ flur: "10", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "50" })
        .miteigentum({
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        })
        .build(),
    ];

    const result = transformFlurstuecke(
      flurstueckeInput,
      undefined,
      undefined,
      undefined,
      true
    );

    expect(result).toEqual([
      {
        angaben: { gemarkung: "Gemarkung1", grundbuchblattnummer: "1" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
        },
        groesseQm: "45",
      },
      {
        angaben: { gemarkung: "Gemarkung2", grundbuchblattnummer: "1" },
        flur: {
          flur: "10",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "50",
      },
    ]);
  });

  it("wohnung with miteigentumTyp none", () => {
    const flurstueckeInput = [
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung1", grundbuchblattnummer: "1" })
        .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
        .build(),
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung2", grundbuchblattnummer: "1" })
        .flur({ flur: "10", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "50" })
        .build(),
    ];

    const result = transformFlurstuecke(
      flurstueckeInput,
      undefined,
      {
        wirtschaftlicheEinheitZaehler: "123",
        wirtschaftlicheEinheitNenner: "789",
      },
      undefined,
      true
    );

    expect(result).toEqual([
      {
        angaben: { gemarkung: "Gemarkung1", grundbuchblattnummer: "1" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "45",
      },
      {
        angaben: { gemarkung: "Gemarkung2", grundbuchblattnummer: "1" },
        flur: {
          flur: "10",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "50",
      },
    ]);
  });

  it("wohnung with miteigentumTyp garage", () => {
    const flurstueckeInput = [
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung1", grundbuchblattnummer: "1" })
        .flur({ flur: "09", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "45" })
        .build(),
      flurstueckFactory
        .angaben({ gemarkung: "Gemarkung2", grundbuchblattnummer: "1" })
        .flur({ flur: "10", flurstueckZaehler: "2", flurstueckNenner: "3" })
        .groesse({ groesseHa: "", groesseA: "", groesseQm: "50" })
        .build(),
    ];

    const result = transformFlurstuecke(
      flurstueckeInput,
      undefined,
      {
        wirtschaftlicheEinheitZaehler: "123",
        wirtschaftlicheEinheitNenner: "234",
      },
      {
        wirtschaftlicheEinheitZaehler: "678",
        wirtschaftlicheEinheitNenner: "789",
      },
      true
    );

    expect(result).toEqual([
      {
        angaben: { gemarkung: "Gemarkung1", grundbuchblattnummer: "1" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "234",
        },
        groesseQm: "45",
      },
      {
        angaben: { gemarkung: "Gemarkung2", grundbuchblattnummer: "1" },
        flur: {
          flur: "10",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "123",
          wirtschaftlicheEinheitNenner: "234",
        },
        groesseQm: "50",
      },
      // flurstuecke should be copied
      {
        // grundbuchblatt should be empty
        angaben: { gemarkung: "Gemarkung1", grundbuchblattnummer: "" },
        flur: {
          flur: "9",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "678",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "45",
      },
      {
        angaben: { gemarkung: "Gemarkung2", grundbuchblattnummer: "" },
        flur: {
          flur: "10",
          flurstueckZaehler: "2",
          flurstueckNenner: "3",
          wirtschaftlicheEinheitZaehler: "678",
          wirtschaftlicheEinheitNenner: "789",
        },
        groesseQm: "50",
      },
    ]);
  });
});

describe("transformFlurstueck old", () => {
  const cases = [
    {
      description: "flur has leading zero",
      data: {
        flur: {
          flur: "0123",
          flurstueckZaehler: "1",
          flurstueckNenner: "2",
        },
      },
      miteigentum: undefined,
      result: {
        flur: "123",
        flurstueckZaehler: "1",
        flurstueckNenner: "2",
      },
    },
    {
      description: "flur is empty",
      data: {
        flur: {
          flur: "",
          flurstueckZaehler: "1",
          flurstueckNenner: "2",
        },
      },
      miteigentum: undefined,
      result: {
        flur: "",
        flurstueckZaehler: "1",
        flurstueckNenner: "2",
      },
    },
    {
      description: "flur without leading",
      data: {
        flur: {
          flur: "123",
          flurstueckZaehler: "1",
          flurstueckNenner: "2",
        },
      },
      miteigentum: undefined,
      result: {
        flur: "123",
        flurstueckZaehler: "1",
        flurstueckNenner: "2",
      },
    },
    {
      description: "with miteigentum set",
      data: {
        flur: {
          flur: "0123",
          flurstueckZaehler: "1",
          flurstueckNenner: "2",
        },
      },
      miteigentum: {
        wirtschaftlicheEinheitZaehler: "23",
        wirtschaftlicheEinheitNenner: "456",
      },
      result: {
        flur: "123",
        flurstueckZaehler: "1",
        flurstueckNenner: "2",
        wirtschaftlicheEinheitZaehler: "23",
        wirtschaftlicheEinheitNenner: "456",
      },
    },
  ];

  test.each(cases)(
    "Should return '$result' if data is '$data' if '$description'",
    ({ data, miteigentum, result }) => {
      expect(transformFlurstueck(data, miteigentum, false).flur).toEqual(
        result
      );
    }
  );
});

describe("transformFreitext", () => {
  const cases = [
    {
      description: "No freitext",
      data: {
        freitext: undefined,
        twoBodenrichtwerte: false,
      },
      result: undefined,
    },
    {
      description: "No freitext and twoBodenrichtwerte true",
      data: {
        freitext: undefined,
        twoBodenrichtwerte: true,
      },
      result: "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück.",
    },
    {
      description: "freitext without new lines",
      data: {
        freitext: "Bitte beachten Sie diese Infos.",
        twoBodenrichtwerte: false,
      },
      result: "Bitte beachten Sie diese Infos.",
    },
    {
      description: "freitext without new lines and twoBodenrichtwerte true",
      data: {
        freitext: "Bitte beachten Sie diese Infos.",
        twoBodenrichtwerte: true,
      },
      result:
        "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück. Bitte beachten Sie diese Infos.",
    },
    {
      description: "freitext with new lines",
      data: {
        freitext: "Bitte beachten Sie diese Infos.",
        twoBodenrichtwerte: false,
      },
      result: "Bitte beachten Sie diese Infos.",
    },
    {
      description: "freitext with new lines",
      data: {
        freitext: "Bitte\n beachten Sie \ndiese\r \n\rInfos.",
        twoBodenrichtwerte: false,
      },
      result: "Bitte beachten Sie diese Infos.",
    },
    {
      description: "freitext with new lines and two Bodenrichtwerte",
      data: {
        freitext: "Bitte\n beachten Sie \ndiese\r \n\rInfos.",
        twoBodenrichtwerte: true,
      },
      result:
        "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück. Bitte beachten Sie diese Infos.",
    },
    {
      description: "freitext with only new lines and two Bodenrichtwerte",
      data: {
        freitext: "\n\n\r\n\r",
        twoBodenrichtwerte: false,
      },
      result: "",
    },
  ];

  test.each(cases)(
    "Should return '$result' if data is '$data' if '$description'",
    ({ data, result }) => {
      expect(transformFreitext(data.freitext, data.twoBodenrichtwerte)).toEqual(
        result
      );
    }
  );
});
