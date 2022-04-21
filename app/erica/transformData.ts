import {
  Flurstueck,
  GrundModel,
  GrundstueckFlurstueckGroesseFields,
} from "~/domain/steps";
import { removeUndefined } from "~/util/removeUndefined";
import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation";
import { GebaeudeWohnflaecheFields } from "~/domain/steps/gebaeude/wohnflaeche";
import { GebaeudeWohnflaechenFields } from "~/domain/steps/gebaeude/wohnflaechen";
import _ from "lodash";

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

export const transforDataToEricaFormat = (inputData: GrundModel) => {
  const dataEricaFormat = {
    grundstueck: {
      typ: inputData.grundstueck?.typ?.typ,
      abweichendeEntwicklung:
        inputData.grundstueck?.abweichendeEntwicklung?.zustand,
      steuernummer: inputData.grundstueck?.steuernummer?.steuernummer,
      adresse: inputData.grundstueck?.adresse,
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
    freitext: inputData.zusammenfassung?.freitext,
  };

  return removeUndefined(dataEricaFormat);
};
