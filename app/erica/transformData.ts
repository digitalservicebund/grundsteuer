import {
  Flurstueck,
  GrundModel,
  GrundstueckAdresseFields,
  GrundstueckFlurstueckGroesseFields,
  GrundstueckFlurstueckMiteigentumGarageFields,
  GrundstueckFlurstueckMiteigentumWohnungFields,
  GrundstueckFlurstueckMiteigentumsanteilFields,
  Person,
  EigentuemerPersonAdresseFields,
  EigentuemerPersonAnteilFields,
} from "~/domain/steps/index.server";
import { removeUndefined } from "~/util/removeUndefined";
import { GebaeudeWohnflaecheFields } from "~/domain/steps/gebaeude/wohnflaeche";
import { GebaeudeWohnflaechenFields } from "~/domain/steps/gebaeude/wohnflaechen";
import _ from "lodash";
import { EigentuemerBruchteilsgemeinschaftFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import {
  EigentuemerBruchteilsgemeinschaftAdresseFields,
  EigentuemerBruchteilsgemeinschaftAngabenFields,
} from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation/flurstueckValidation";

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
    (10000 * Number.parseInt(groesse.groesseHa.trim() || "0") +
      100 * Number.parseInt(groesse.groesseA.trim() || "0") +
      Number.parseInt(groesse.groesseQm.trim() || "0"))
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
    splits[0] + "," + (splits[1] || "") + Array(difference).fill("0").join("")
  );
};

const transformWirtschaftlicheEinheitZaehler = (value?: string) => {
  // remove leading zeros
  return value ? parseFloat(value?.replace(",", ".")).toString() : value;
};

export const transformBodenrichtwert = (value?: string) => {
  if (!value) return value;
  const valueWithoutLeadingZeros = parseFloat(value?.replace(",", "."))
    .toString()
    .replace(".", ",");
  return fillPostCommaToLength(2, valueWithoutLeadingZeros);
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

const getGarageFlurstuecke = (
  flurstuecke: Flurstueck[],
  miteigentumGarage: GrundstueckFlurstueckMiteigentumGarageFields | undefined,
  showTestFeatures: boolean
) => {
  if (miteigentumGarage) {
    // We duplicate the flurstuecke for the flat as flat and garage have the same flurstuecke and just apply the garage miteigentum
    return flurstuecke.map((flurstueck: Flurstueck) => {
      const flurstueckCopy = _.cloneDeep(flurstueck);
      // The flat and garage are on the same flurstueck but on different grundbuchblaetter. As we only ask for *one* grundguchblattnummer, we disregard the (optional field) grundbuchblattnummer for the garagen flurstueck.
      if (flurstueckCopy.angaben?.grundbuchblattnummer)
        flurstueckCopy.angaben.grundbuchblattnummer = "";
      return transformFlurstueck(
        flurstueckCopy,
        miteigentumGarage,
        showTestFeatures
      );
    });
  }
  return [];
};

export const transformFlurstuecke = (
  flurstuecke: Flurstueck[] | undefined,
  miteigentumsanteil: GrundstueckFlurstueckMiteigentumsanteilFields | undefined,
  miteigentumWohnung: GrundstueckFlurstueckMiteigentumWohnungFields | undefined,
  miteigentumGarage: GrundstueckFlurstueckMiteigentumGarageFields | undefined,
  showTestFeatures: boolean
) => {
  if (!showTestFeatures) {
    if (!flurstuecke) return undefined;
    return flurstuecke.map((value) =>
      transformFlurstueck(value, miteigentumsanteil, showTestFeatures)
    );
  }
  if (!flurstuecke) return undefined;

  const transformedGaragenFlurstuecke = getGarageFlurstuecke(
    flurstuecke,
    miteigentumGarage,
    showTestFeatures
  );
  const transformedFlurstuecke = flurstuecke.map((value) =>
    transformFlurstueck(value, miteigentumWohnung, showTestFeatures)
  );
  return [...transformedFlurstuecke, ...transformedGaragenFlurstuecke];
};

export const transformFlurstueck = (
  flurstueck: Flurstueck,
  miteigentum: GrundstueckFlurstueckMiteigentumsanteilFields | undefined,
  showTestFeatures: boolean
) => {
  if (!showTestFeatures) {
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
  }

  const miteigentumZaehler =
    flurstueck.miteigentum?.wirtschaftlicheEinheitZaehler ||
    miteigentum?.wirtschaftlicheEinheitZaehler;
  const miteigentumNenner =
    flurstueck.miteigentum?.wirtschaftlicheEinheitNenner ||
    miteigentum?.wirtschaftlicheEinheitNenner;

  return {
    angaben: flurstueck.angaben,
    flur: {
      flur: flurstueck.flur?.flur
        ? "" + Number.parseInt(flurstueck.flur?.flur)
        : flurstueck.flur?.flur,
      flurstueckZaehler: flurstueck.flur?.flurstueckZaehler,
      flurstueckNenner: flurstueck.flur?.flurstueckNenner,
      wirtschaftlicheEinheitZaehler:
        transformWirtschaftlicheEinheitZaehler(miteigentumZaehler),
      wirtschaftlicheEinheitNenner: miteigentumNenner,
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

export const transformFreitext = (
  freitext?: string,
  twoBodenrichtwerte?: boolean
) => {
  let freitextWithoutNewLines = freitext?.replace(/(\r\n|\n|\r)/gm, "");
  if (twoBodenrichtwerte) {
    const twoBodenrichtwerteText =
      "Es existiert ein zweiter Bodenrichtwert für dieses Grundstück.";
    freitextWithoutNewLines =
      twoBodenrichtwerteText +
      (freitextWithoutNewLines ? " " + freitextWithoutNewLines : "");
  }
  return freitextWithoutNewLines;
};

export const transformDataToEricaFormat = (inputData: GrundModel) => {
  const dataEricaFormat = {
    grundstueck: {
      typ: inputData.grundstueck?.typ?.typ,
      abweichendeEntwicklung:
        inputData.grundstueck?.abweichendeEntwicklung?.zustand,
      steuernummer: inputData.grundstueck?.steuernummer?.steuernummer.replace(
        /\D/g,
        ""
      ),
      adresse: {
        ...inputData.grundstueck?.adresse,
        ...separateHausnummerAndZusatz(
          inputData.grundstueck?.adresse?.hausnummer
        ),
      },
      innerhalbEinerGemeinde:
        inputData.grundstueck?.gemeinde?.innerhalbEinerGemeinde,
      bodenrichtwert: transformBodenrichtwert(
        inputData.grundstueck?.bodenrichtwertEingabe?.bodenrichtwert
      ),
      flurstueck: transformFlurstuecke(
        inputData.grundstueck?.flurstueck,
        inputData.grundstueck?.miteigentumsanteil,
        inputData.grundstueck?.miteigentumWohnung,
        inputData.grundstueck?.miteigentumGarage,
        testFeaturesEnabled()
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
