import { PruefenMachineContext } from "~/domain/pruefen/states.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export type PruefenCondition = (
  context: PruefenMachineContext | undefined
) => boolean;
export type PruefenConditions = Record<string, PruefenCondition>;

const isEigentuemer: PruefenCondition = (context) => {
  const eligibleEigentuemerArten = [
    "eigentuemer",
    "angehoerig",
    "eigentuemerNeu",
  ];
  return !!(
    context?.start?.abgeber &&
    eligibleEigentuemerArten.includes(context.start.abgeber)
  );
};

const isPrivatperson: PruefenCondition = (context) => {
  return (
    context?.eigentuemerTyp?.eigentuemerTyp == "privatperson" ||
    context?.eigentuemerTyp?.eigentuemerTyp == "mehrereErben"
  );
};

const isBundesmodelBundesland: PruefenCondition = (context) => {
  const bundesmodellBundeslaender = [
    "BE",
    "BB",
    "HB",
    "MV",
    "NW",
    "RP",
    "SL",
    "SN",
    "ST",
    "SH",
    "TH",
  ];
  return !!(
    context?.bundesland?.bundesland &&
    bundesmodellBundeslaender.includes(context.bundesland.bundesland)
  );
};

const showTestFeaturesAndBundesmodel: PruefenCondition = (context) => {
  return testFeaturesEnabled() && isBundesmodelBundesland(context);
};

const isEligibleGrundstueckArt: PruefenCondition = (context) => {
  const eligibleGrundstueckArten = [
    "einfamilienhaus",
    "zweifamilienhaus",
    "eigentumswohnung",
    "unbebaut",
  ];
  return !!(
    context?.grundstueckArt?.grundstueckArt &&
    eligibleGrundstueckArten.includes(context.grundstueckArt.grundstueckArt)
  );
};

const isNotAusland: PruefenCondition = (context) => {
  return context?.ausland?.ausland == "false";
};

const isNotFremderBoden: PruefenCondition = (context) => {
  const notFremderBoden = ["false", "noBuilding"];
  return !!(
    context?.fremderBoden?.fremderBoden &&
    notFremderBoden.includes(context.fremderBoden.fremderBoden)
  );
};

const isNotBeguenstigung: PruefenCondition = (context) => {
  return context?.beguenstigung?.beguenstigung == "false";
};

export const pruefenConditions: PruefenConditions = {
  isPrivatperson,
  isEigentuemer,
  isBundesmodelBundesland,
  showTestFeaturesAndBundesmodel,
  isEligibleGrundstueckArt,
  isNotAusland,
  isNotFremderBoden,
  isNotBeguenstigung,
};
