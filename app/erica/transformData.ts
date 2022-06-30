import {
  Flurstueck,
  GrundModel,
  GrundstueckAdresseFields,
  GrundstueckFlurstueckGroesseFields,
  Person,
} from "~/domain/steps";
import { removeUndefined } from "~/util/removeUndefined";
import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation";
import { GebaeudeWohnflaecheFields } from "~/domain/steps/gebaeude/wohnflaeche";
import { GebaeudeWohnflaechenFields } from "~/domain/steps/gebaeude/wohnflaechen";
import _ from "lodash";
import { EigentuemerBruchteilsgemeinschaftFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import {
  EigentuemerBruchteilsgemeinschaftAdresseFields,
  EigentuemerBruchteilsgemeinschaftAngabenFields,
} from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import { EigentuemerPersonAdresseFields } from "~/domain/steps/eigentuemer/person/adresse";
import { EigentuemerPersonAnteilFields } from "~/domain/steps/eigentuemer/person/anteil";
import { GrundstueckFlurstueckMiteigentumsanteilFields } from "~/domain/steps/grundstueck/miteigentumsanteil";

export const calculateGroesse = (
  groesse: GrundstueckFlurstueckGroesseFields
) => {
  if (
    !validateFlurstueckGroesseRequired({
      valueHa: groesse.groesseHa,
      valueA: groesse.groesseA,
      valueQm: groesse.groesseQm,
    }) ||
    !validateFlurstueckGroesse({
      valueHa: groesse.groesseHa,
      valueA: groesse.groesseA,
      valueQm: groesse.groesseQm,
    })
  )
    throw Error("Invalid groesse format");

  return (
    "" +
    (10000 * Number.parseInt(groesse.groesseHa || "0") +
      100 * Number.parseInt(groesse.groesseA || "0") +
      Number.parseInt(groesse.groesseQm || "0"))
  );
};

// Split up to four numbers (hausnummer) from the rest (hausnummerzusatz)
export const separateHausnummerAndZusatz = (inputHausnummer?: string) => {
  if (!inputHausnummer) {
    return {
      hausnummer: undefined,
      hausnummerzusatz: undefined,
    };
  }

  inputHausnummer = inputHausnummer.trim();

  let separatedHausnummer = "";
  let nummerIndex = 0;
  for (nummerIndex; nummerIndex < 4; nummerIndex++) {
    const nummerDigit = Number.parseInt(inputHausnummer[nummerIndex]);
    if (_.isNaN(nummerDigit)) break;
    separatedHausnummer += "" + nummerDigit;
  }
  const separatedZusatz = inputHausnummer.slice(nummerIndex);

  return {
    hausnummer: separatedHausnummer,
    hausnummerzusatz: separatedZusatz,
  };
};

// Add zeros after comma until the length matches postCommaLength
export const fillPostCommaToLength = (
  postCommaLength: number,
  value?: string
) => {
  if (!value || value.length == 0 || postCommaLength == 0) return value;

  const splits = value.trim().split(",");
  if (splits[1] && splits[1].length >= postCommaLength) return value;

  const difference = splits[1]
    ? postCommaLength - splits[1].length
    : postCommaLength;
  return (
    splits[0]?.trim() +
    "," +
    (splits[1]?.trim() || "") +
    Array(difference).fill("0").join("")
  );
};

const transformWirtschaftlicheEinheitZaehler = (value?: string) => {
  return fillPostCommaToLength(4, value)?.replace(",", ".");
};

export const transformDate = (value?: string) => {
  if (!value) return undefined;
  return value.trim().split(".").reverse().join("-");
};

const calculateWohnflaechen = (
  wohnflaeche?: GebaeudeWohnflaecheFields,
  wohnflaechen?: GebaeudeWohnflaechenFields
) => {
  return _.compact([
    wohnflaeche?.wohnflaeche,
    wohnflaechen?.wohnflaeche1,
    wohnflaechen?.wohnflaeche2,
  ]);
};

export const transformFlurstueck = (
  flurstueck: Flurstueck,
  miteigentum: GrundstueckFlurstueckMiteigentumsanteilFields | undefined
) => {
  return {
    angaben: flurstueck.angaben,
    flur: {
      flur: flurstueck.flur?.flur
        ? "" + Number.parseInt(flurstueck.flur?.flur)
        : flurstueck.flur?.flur,
      flurstueckZaehler: flurstueck.flur?.flurstueckZaehler,
      flurstueckNenner: flurstueck.flur?.flurstueckNenner,
      wirtschaftlicheEinheitZaehler: transformWirtschaftlicheEinheitZaehler(
        miteigentum?.wirtschaftlicheEinheitZaehler
      ),
      wirtschaftlicheEinheitNenner: miteigentum?.wirtschaftlicheEinheitNenner,
    },
    groesseQm: flurstueck.groesse
      ? calculateGroesse(flurstueck.groesse)
      : undefined,
  };
};

export const transformAnteil = (anteil?: EigentuemerPersonAnteilFields) => {
  return anteil || { zaehler: "1", nenner: "1" };
};

const transformPerson = (person: Person) => {
  return {
    persoenlicheAngaben: {
      ...person.persoenlicheAngaben,
      geburtsdatum: transformDate(person.persoenlicheAngaben?.geburtsdatum),
    },
    adresse: {
      strasse: person.adresse?.strasse,
      ...separateHausnummerAndZusatz(person.adresse?.hausnummer),
      postfach: person.adresse?.postfach,
      plz: person.adresse?.plz,
      ort: person.adresse?.ort,
    },
    telefonnummer: person.adresse?.telefonnummer,
    steuerId: person.steuerId?.steuerId.split(" ").join(""),
    vertreter: {
      name: person.vertreter?.name,
      adresse: {
        strasse: person.vertreter?.adresse?.strasse,
        ...separateHausnummerAndZusatz(person.vertreter?.adresse?.hausnummer),
        postfach: person.vertreter?.adresse?.postfach,
        plz: person.vertreter?.adresse?.plz,
        ort: person.vertreter?.adresse?.ort,
      },
      telefonnummer: person.vertreter?.adresse?.telefonnummer,
    },
    anteil: transformAnteil(person.anteil),
  };
};

export const transformBruchteilsgemeinschaftName = (
  grundstueckAdresse?: GrundstueckAdresseFields
) => {
  return `Bruchteilsgem. ${grundstueckAdresse?.strasse} ${grundstueckAdresse?.hausnummer}`;
};

export const transformBruchteilsgemeinschaftAdresse = (
  eigentuemerAdresse?: EigentuemerPersonAdresseFields
) => {
  return {
    strasse: eigentuemerAdresse?.strasse,
    ...separateHausnummerAndZusatz(eigentuemerAdresse?.hausnummer),
    postfach: eigentuemerAdresse?.postfach,
    plz: eigentuemerAdresse?.plz,
    ort: eigentuemerAdresse?.ort,
  } as EigentuemerBruchteilsgemeinschaftAdresseFields;
};

const transformBruchteilsgemeinschaft = (
  bruchteilsgemeinschaft?: EigentuemerBruchteilsgemeinschaftFields,
  angaben?: EigentuemerBruchteilsgemeinschaftAngabenFields,
  eigentuemerAdresse?: EigentuemerPersonAdresseFields,
  grundstueckAdresse?: GrundstueckAdresseFields
) => {
  if (bruchteilsgemeinschaft?.predefinedData == "true") {
    return {
      name: transformBruchteilsgemeinschaftName(grundstueckAdresse),
      adresse: transformBruchteilsgemeinschaftAdresse(eigentuemerAdresse),
    };
  } else {
    return {
      name: angaben?.name,
      adresse: {
        strasse: angaben?.strasse,
        ...separateHausnummerAndZusatz(angaben?.hausnummer),
        postfach: angaben?.postfach,
        plz: angaben?.plz,
        ort: angaben?.ort,
      },
    };
  }
};

const transformFreitext = (freitext?: string, twoBodenrichtwerte?: boolean) => {
  if (twoBodenrichtwerte) {
    const twoBodenrichtwerteText =
      "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück.";
    freitext = twoBodenrichtwerteText + (freitext ? " " + freitext : "");
  }
  return freitext;
};

export const transformDataToEricaFormat = (inputData: GrundModel) => {
  const dataEricaFormat = {
    grundstueck: {
      typ: inputData.grundstueck?.typ?.typ,
      abweichendeEntwicklung:
        inputData.grundstueck?.abweichendeEntwicklung?.zustand,
      steuernummer: inputData.grundstueck?.steuernummer?.steuernummer,
      adresse: {
        ...inputData.grundstueck?.adresse,
        ...separateHausnummerAndZusatz(
          inputData.grundstueck?.adresse?.hausnummer
        ),
      },
      innerhalbEinerGemeinde:
        inputData.grundstueck?.gemeinde?.innerhalbEinerGemeinde,
      bodenrichtwert: fillPostCommaToLength(
        2,
        inputData.grundstueck?.bodenrichtwertEingabe?.bodenrichtwert
      ),
      flurstueck: inputData.grundstueck?.flurstueck?.map((value) =>
        transformFlurstueck(value, inputData.grundstueck?.miteigentumsanteil)
      ),
    },
    gebaeude: {
      ab1949: inputData.gebaeude?.ab1949,
      baujahr: inputData.gebaeude?.baujahr,
      kernsaniert: inputData.gebaeude?.kernsaniert,
      kernsanierungsjahr: inputData.gebaeude?.kernsanierungsjahr,
      abbruchverpflichtung: inputData.gebaeude?.abbruchverpflichtung,
      abbruchverpflichtungsjahr: inputData.gebaeude?.abbruchverpflichtungsjahr,
      wohnflaechen: calculateWohnflaechen(
        inputData.gebaeude?.wohnflaeche,
        inputData.gebaeude?.wohnflaechen
      ),
      weitereWohnraeume: inputData.gebaeude?.weitereWohnraeume,
      weitereWohnraeumeDetails: inputData.gebaeude?.weitereWohnraeumeDetails,
      garagen: inputData.gebaeude?.garagen,
      garagenAnzahl: inputData.gebaeude?.garagenAnzahl,
    },
    eigentuemer: {
      person: inputData.eigentuemer?.person?.map(transformPerson),
      verheiratet: inputData.eigentuemer?.verheiratet?.areVerheiratet,
      bruchteilsgemeinschaft: transformBruchteilsgemeinschaft(
        inputData.eigentuemer?.bruchteilsgemeinschaft,
        inputData.eigentuemer?.bruchteilsgemeinschaftangaben?.angaben,
        inputData.eigentuemer?.person?.[0].adresse,
        inputData.grundstueck?.adresse
      ),
      empfangsbevollmaechtigter: {
        name: inputData.eigentuemer?.empfangsbevollmaechtigter?.name,
        adresse: {
          strasse:
            inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse?.strasse,
          ...separateHausnummerAndZusatz(
            inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse
              ?.hausnummer
          ),
          postfach:
            inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse?.postfach,
          plz: inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse?.plz,
          ort: inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse?.ort,
        },
        telefonnummer:
          inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse
            ?.telefonnummer,
      },
    },
    freitext: transformFreitext(
      inputData.zusammenfassung?.freitext,
      inputData.grundstueck?.bodenrichtwertAnzahl?.anzahl === "2"
    ),
  };

  return removeUndefined(dataEricaFormat, true);
};
