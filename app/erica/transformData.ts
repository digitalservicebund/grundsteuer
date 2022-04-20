import { Flurstueck, GrundModel } from "~/domain/steps";
import { removeUndefined } from "~/util/removeUndefined";

const transformFlurstueck = (flurstueck: Flurstueck) => {
  return {
    angaben: flurstueck.angaben,
    flur: flurstueck.flur,
    // TODO calc groesse
    groesseQm: flurstueck.groesse?.groesseQm,
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
