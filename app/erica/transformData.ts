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
import { EigentuemerBruchteilsgemeinschaftAngabenFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import { EigentuemerPersonAdresseFields } from "~/domain/steps/eigentuemer/person/adresse";

export const calculateGroesse = (
  groesse: GrundstueckFlurstueckGroesseFields
) => {
  const convertToAtLeastTwoDigitString = (value: string) => {
    let numberString = "";

    // get rid of leading zeros and spaces
    if (value) numberString = "" + Number.parseInt(value);

    if (numberString.length == 0) {
      numberString = "00";
    } else if (numberString.length == 1) {
      numberString = "0" + numberString;
    }
    return numberString;
  };

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
    Number.parseInt(
      convertToAtLeastTwoDigitString(groesse.groesseHa) +
        convertToAtLeastTwoDigitString(groesse.groesseA) +
        convertToAtLeastTwoDigitString(groesse.groesseQm)
    )
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

const transformFlurstueck = (flurstueck: Flurstueck) => {
  return {
    angaben: flurstueck.angaben,
    flur: flurstueck.flur,
    groesseQm: flurstueck.groesse
      ? calculateGroesse(flurstueck.groesse)
      : undefined,
  };
};

const transformPerson = (person: Person) => {
  return {
    persoenlicheAngaben: person.persoenlicheAngaben,
    adresse: {
      strasse: person.adresse?.strasse,
      ...separateHausnummerAndZusatz(person.adresse?.hausnummer),
      postfach: person.adresse?.postfach,
      plz: person.adresse?.plz,
      ort: person.adresse?.ort,
    },
    telefonnummer: {
      telefonnummer: person.adresse?.telefonnummer,
    },
    steuerId: person.steuerId,
    vertreter: {
      name: person.vertreter?.name,
      adresse: {
        strasse: person.vertreter?.adresse?.strasse,
        ...separateHausnummerAndZusatz(person.vertreter?.adresse?.hausnummer),
        postfach: person.vertreter?.adresse?.postfach,
        plz: person.vertreter?.adresse?.plz,
        ort: person.vertreter?.adresse?.ort,
      },
      telefonnummer: {
        telefonnummer: person.vertreter?.adresse?.telefonnummer,
      },
    },
    anteil: person.anteil,
  };
};

const transformBruchteilsgemeinschaft = (
  bruchteilsgemeinschaft?: EigentuemerBruchteilsgemeinschaftFields,
  angaben?: EigentuemerBruchteilsgemeinschaftAngabenFields,
  eigentuemerAdresse?: EigentuemerPersonAdresseFields,
  grundstueckAdresse?: GrundstueckAdresseFields
) => {
  if (bruchteilsgemeinschaft?.predefinedData == "true") {
    return {
      name: `Bruchteilsgem. ${eigentuemerAdresse?.strasse} ${eigentuemerAdresse?.hausnummer}`,
      adresse: {
        strasse: grundstueckAdresse?.strasse,
        ...separateHausnummerAndZusatz(grundstueckAdresse?.hausnummer),
        plz: grundstueckAdresse?.plz,
        ort: grundstueckAdresse?.ort,
      },
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

export const transforDataToEricaFormat = (inputData: GrundModel) => {
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
      bodenrichtwert: inputData.grundstueck?.bodenrichtwert?.bodenrichtwert,
      flurstueck: inputData.grundstueck?.flurstueck?.map(transformFlurstueck),
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
      verheiratet: inputData.eigentuemer?.verheiratet,
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
        telefonnummer: {
          telefonnummer:
            inputData.eigentuemer?.empfangsbevollmaechtigter?.adresse
              ?.telefonnummer,
        },
      },
    },
    freitext: transformFreitext(
      inputData.zusammenfassung?.freitext,
      inputData.grundstueck?.bodenrichtwert?.twoBodenrichtwerte
    ),
  };

  return removeUndefined(dataEricaFormat);
};
