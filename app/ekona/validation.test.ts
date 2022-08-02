import _ from "lodash";
import { extractIdentData, ValidatedEkonaData } from "~/ekona/validation";

const ekonaDataInland = {
  issuer: "https://e4k-portal.een.elster.de",
  inResponseTo: "_cb378be91188da32e3c6",
  sessionIndex: "_946b9a312742e1f2963d0341f5f2f6c622b9c0e7",
  IstTestkonto: "false",
  DatenkranzTyp: "IdNr",
  ElsterVertrauensniveauIdentifizierung: "substanziell",
  ElsterVertrauensniveauAuthentifizierung: "substanziell",
  IdNr: "59477301287",
  Vorname: "Maré",
  Name: "Renièr",
  Geburtsdatum: "01.01.1989",
  Anschrift: {
    $: {
      xmlnsekona: "http://www.elster.de/schema/ekona/saml/extensions",
      xmlnsxsi: "http://www.w3.org/2001/XMLSchema-instance",
      xsitype: "ekona:AdresseType",
    },
    Typ: [{ _: "Inland" }],
    Strasse: [{ _: "Theaterstraße" }],
    Hausnummer: [{ _: "58" }],
    PLZ: [{ _: "90762" }],
    Ort: [{ _: "Fürth" }],
    Land: [{ _: "DE" }],
    Adressergaenzung: [{ _: "EG" }],
  },
  attributes: {
    IstTestkonto: "false",
    DatenkranzTyp: "IdNr",
    ElsterVertrauensniveauIdentifizierung: "substanziell",
    ElsterVertrauensniveauAuthentifizierung: "substanziell",
    IdNr: "59477301287",
    Vorname: "Maré",
    Name: "Renièr",
    Geburtsdatum: "01.01.1989",
    Anschrift: {
      $: {
        xmlnsekona: "http://www.elster.de/schema/ekona/saml/extensions",
        xmlnsxsi: "http://www.w3.org/2001/XMLSchema-instance",
        xsitype: "ekona:AdresseType",
      },
      Typ: [{ _: "Inland" }],
      Strasse: [{ _: "Theaterstraße" }],
      Hausnummer: [{ _: "58" }],
      PLZ: [{ _: "90762" }],
      Ort: [{ _: "Fürth" }],
      Land: [{ _: "DE" }],
      Adressergaenzung: [{ _: "EG" }],
    },
  },
};
const ekonaDataAusland = {
  issuer: "https://e4k-portal.een.elster.de",
  inResponseTo: "_7a130d8bacb6cceb6696",
  sessionIndex: "_de58d799be53cc9f124ea6c899dcc28fc6115059",
  IstTestkonto: "false",
  DatenkranzTyp: "IdNr",
  ElsterVertrauensniveauIdentifizierung: "substanziell",
  ElsterVertrauensniveauAuthentifizierung: "substanziell",
  IdNr: "21374069801",
  Vorname: "Børge",
  Name: "Nielsen",
  Geburtsdatum: "01.01.1900",
  Anschrift: {
    $: {
      xmlnsekona: "http://www.elster.de/schema/ekona/saml/extensions",
      xmlnsxsi: "http://www.w3.org/2001/XMLSchema-instance",
      xsitype: "ekonaAdresseType",
    },
    Typ: [{ _: "Ausland" }],
    Strasse: [{ _: "Egtoftevej" }],
    Hausnummer: [{ _: "55" }],
    PLZ: [{ _: "2950" }],
    Ort: [{ _: "Vedbæk" }],
    Land: [{ _: "DK" }],
  },
  attributes: {
    IstTestkonto: "false",
    DatenkranzTyp: "IdNr",
    ElsterVertrauensniveauIdentifizierung: "substanziell",
    ElsterVertrauensniveauAuthentifizierung: "substanziell",
    IdNr: "21374069801",
    Vorname: "Børge",
    Name: "Nielsen",
    Geburtsdatum: "01.01.1900",
    Anschrift: {
      $: {
        xmlnsekona: "http//www.elster.de/schema/ekona/saml/extensions",
        xmlnsxsi: "http//www.w3.org/2001/XMLSchema-instance",
        xsitype: "ekonaAdresseType",
      },
      Typ: [{ _: "Ausland" }],
      Strasse: [{ _: "Egtoftevej" }],
      Hausnummer: [{ _: "55" }],
      PLZ: [{ _: "2950" }],
      Ort: [{ _: "Vedbæk" }],
      Land: [{ _: "DK" }],
    },
  },
};

const ekonaDataWithoutPLZ = {
  issuer: "https://e4k-portal.een.elster.de",
  inResponseTo: "_7a130d8bacb6cceb6696",
  sessionIndex: "_de58d799be53cc9f124ea6c899dcc28fc6115059",
  IstTestkonto: "false",
  DatenkranzTyp: "IdNr",
  ElsterVertrauensniveauIdentifizierung: "substanziell",
  ElsterVertrauensniveauAuthentifizierung: "substanziell",
  IdNr: "21374069801",
  Vorname: "Børge",
  Name: "Nielsen",
  Geburtsdatum: "01.01.1900",
  Anschrift: {
    $: {
      xmlnsekona: "http://www.elster.de/schema/ekona/saml/extensions",
      xmlnsxsi: "http://www.w3.org/2001/XMLSchema-instance",
      xsitype: "ekonaAdresseType",
    },
    Typ: [{ _: "Ausland" }],
    Strasse: [{ _: "Egtoftevej" }],
    Hausnummer: [{ _: "55" }],
    Ort: [{ _: "Vedbæk" }],
    Land: [{ _: "DK" }],
  },
  attributes: {
    IstTestkonto: "false",
    DatenkranzTyp: "IdNr",
    ElsterVertrauensniveauIdentifizierung: "substanziell",
    ElsterVertrauensniveauAuthentifizierung: "substanziell",
    IdNr: "21374069801",
    Vorname: "Børge",
    Name: "Nielsen",
    Geburtsdatum: "01.01.1900",
    Anschrift: {
      $: {
        xmlnsekona: "http//www.elster.de/schema/ekona/saml/extensions",
        xmlnsxsi: "http//www.w3.org/2001/XMLSchema-instance",
        xsitype: "ekonaAdresseType",
      },
      Typ: [{ _: "Ausland" }],
      Strasse: [{ _: "Egtoftevej" }],
      Hausnummer: [{ _: "55" }],
      Ort: [{ _: "Vedbæk" }],
      Land: [{ _: "DK" }],
    },
  },
};

describe("extractIdentData", () => {
  it("extracts correct data if all data available", () => {
    const extractedData = extractIdentData(ekonaDataInland);
    expect(extractedData).toEqual({
      idnr: "59477301287",
      firstName: "Maré",
      lastName: "Renièr",
      street: "Theaterstraße",
      housenumber: "58",
      postalCode: "90762",
      city: "Fürth",
      country: "DE",
      addressSupplement: "EG",
    });
  });

  it("extracts correct data if auslandsadresse", () => {
    const extractedData = extractIdentData(ekonaDataAusland);
    expect(extractedData).toEqual({
      idnr: "21374069801",
      firstName: "Børge",
      lastName: "Nielsen",
      street: "Egtoftevej",
      housenumber: "55",
      postalCode: "2950",
      city: "Vedbæk",
      country: "DK",
      addressSupplement: undefined,
    });
  });

  it("extracts no postal code if none given", () => {
    const extractedData = extractIdentData(ekonaDataWithoutPLZ);
    expect(extractedData.postalCode).toBeUndefined();
  });

  describe("with missing values", () => {
    const removeAttribute = (
      inputData: ValidatedEkonaData,
      attributeToDelete: string
    ) => {
      const dataCopy: Partial<ValidatedEkonaData> =
        _.cloneDeep(ekonaDataInland);
      const attributesList = attributeToDelete.split(".");
      if (attributesList.length == 2)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (dataCopy as any)[attributesList[0]][attributesList[1]];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (dataCopy as any)[attributeToDelete];
      return dataCopy;
    };
    const casesWithoutAllAttributes = [
      {
        inputData: removeAttribute(ekonaDataInland, "IdNr"),
        missingValue: "IdNr",
      },
      {
        inputData: removeAttribute(ekonaDataInland, "Name"),
        missingValue: "Name",
      },
      {
        inputData: removeAttribute(ekonaDataInland, "Anschrift.Strasse"),
        missingValue: "Strasse",
      },
      {
        inputData: removeAttribute(ekonaDataInland, "Anschrift.Hausnummer"),
        missingValue: "Hausnummer",
      },
      {
        inputData: removeAttribute(ekonaDataInland, "Anschrift.Ort"),
        missingValue: "Ort",
      },
      {
        inputData: removeAttribute(ekonaDataInland, "Anschrift.Land"),
        missingValue: "Land",
      },
    ];

    test.each(casesWithoutAllAttributes)(
      "Should throw if value is '$missingValue' is missing.",
      ({ inputData }) => {
        expect(() => {
          extractIdentData(<ValidatedEkonaData>inputData);
        }).toThrow();
      }
    );

    const removeElementsFromList = (
      inputData: ValidatedEkonaData,
      attributeToDelete: string
    ) => {
      const dataCopy: Partial<ValidatedEkonaData> =
        _.cloneDeep(ekonaDataInland);
      const attributesList = attributeToDelete.split(".");
      if (attributesList.length == 2)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dataCopy as any)[attributesList[0]][attributesList[1]] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dataCopy as any)[attributeToDelete] = [];
      return dataCopy;
    };
    const casesWithEmptyLists = [
      {
        inputData: removeElementsFromList(ekonaDataInland, "Anschrift.Strasse"),
        missingValue: "Strasse",
      },
      {
        inputData: removeElementsFromList(
          ekonaDataInland,
          "Anschrift.Hausnummer"
        ),
        missingValue: "Hausnummer",
      },
      {
        inputData: removeElementsFromList(ekonaDataInland, "Anschrift.Ort"),
        missingValue: "Ort",
      },
      {
        inputData: removeElementsFromList(ekonaDataInland, "Anschrift.Land"),
        missingValue: "Land",
      },
    ];

    test.each(casesWithEmptyLists)(
      "Should throw if value is '$missingValue' is empty list.",
      ({ inputData }) => {
        expect(() => {
          extractIdentData(<ValidatedEkonaData>inputData);
        }).toThrow();
      }
    );
  });
});
