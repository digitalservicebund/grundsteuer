import {
  Flurstueck,
  GrundModel,
  GrundstueckFlurstueckGroesseFields,
} from "~/domain/steps";
import { removeUndefined } from "~/util/removeUndefined";
import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseLength,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation";

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
    freitext: inputData.zusammenfassung?.freitext,
  };

  return removeUndefined(dataEricaFormat);
};
