import { PruefenMachineContext } from "~/domain/pruefen/states.server";

export type PruefenCondition = (
  context: PruefenMachineContext | undefined
) => boolean;

const isEigentuemer: PruefenCondition = (context) => {
  const eligibleEigentuemerArten = [
    "eigentuemer",
    "angehoerig",
    "eigentuemerNeu",
  ];
  return !!(
    context?.abgeber?.abgeber &&
    eligibleEigentuemerArten.includes(context?.abgeber?.abgeber)
  );
};

const isPrivatperson: PruefenCondition = (context) => {
  return (
    context?.eigentuemerTyp?.eigentuemerTyp === "privatperson" ||
    context?.eigentuemerTyp?.eigentuemerTyp === "mehrereErben"
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

const isBewohnbar: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar === "bewohnbar";
};

const isUnbewohnbar: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar === "unbewohnbar";
};

const isUnbebaut: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar === "unbebaut";
};

const isEligibleGebaeudeArtBewohnbar: PruefenCondition = (context) => {
  const eligibleGebaeudeArten = [
    "einfamilienhaus",
    "zweifamilienhaus",
    "eigentumswohnung",
  ];
  return !!(
    isBewohnbar(context) &&
    context?.gebaeudeArtBewohnbar?.gebaeude &&
    eligibleGebaeudeArten.includes(context.gebaeudeArtBewohnbar.gebaeude)
  );
};

const isEligibleGebaeudeArtUnbewohnbar: PruefenCondition = (context) => {
  const eligibleGebaeudeArten = ["imBau", "verfallen"];
  return !!(
    isUnbewohnbar(context) &&
    context?.gebaeudeArtUnbewohnbar?.gebaeude &&
    eligibleGebaeudeArten.includes(context.gebaeudeArtUnbewohnbar.gebaeude)
  );
};

const isEligibleGebaeudeArtUnbebaut: PruefenCondition = (context) => {
  return isUnbebaut(context) && context?.gebaeudeArtUnbebaut?.art === "baureif";
};

const isSupportedGrundstueckArt: PruefenCondition = (context) => {
  return (
    isEligibleGebaeudeArtBewohnbar(context) ||
    isEligibleGebaeudeArtUnbewohnbar(context) ||
    isEligibleGebaeudeArtUnbebaut(context) ||
    isPrivatUnbebaut(context)
  );
};

const isNotAusland: PruefenCondition = (context) => {
  return context?.ausland?.ausland === "false";
};

const isNotFremderBoden: PruefenCondition = (context) => {
  const notFremderBoden = ["false", "noBuilding"];
  return !!(
    context?.fremderBoden?.fremderBoden &&
    notFremderBoden.includes(context.fremderBoden.fremderBoden)
  );
};

const isNotBeguenstigung: PruefenCondition = (context) => {
  return context?.beguenstigung?.beguenstigung === "false";
};

const isHof: PruefenCondition = (context) => {
  return (
    isBewohnbar(context) && context?.gebaeudeArtBewohnbar?.gebaeude === "hof"
  );
};

const isAckerOrGarten: PruefenCondition = (context) => {
  return !!(
    isUnbebaut(context) &&
    context?.gebaeudeArtUnbebaut?.art &&
    ["acker", "garten"].includes(context?.gebaeudeArtUnbebaut?.art)
  );
};

const isPrivatBebaut: PruefenCondition = (context) => {
  return isHof(context) && context?.nutzungsartBebaut?.privat === "true";
};

const isPrivatUnbebaut: PruefenCondition = (context) => {
  return (
    isAckerOrGarten(context) && context?.nutzungsartUnbebaut?.privat === "true"
  );
};

const isWirtschaftlichUnbebaut: PruefenCondition = (context) => {
  return (
    isAckerOrGarten(context) && context?.nutzungsartUnbebaut?.privat === "false"
  );
};

const isUnsupportedBewohnbar: PruefenCondition = (context) => {
  const supported = [
    "einfamilienhaus",
    "zweifamilienhaus",
    "eigentumswohnung",
    "hof",
  ];
  return !!(
    isBewohnbar(context) &&
    context?.gebaeudeArtBewohnbar?.gebaeude &&
    !supported.includes(context.gebaeudeArtBewohnbar.gebaeude)
  );
};

const isUnsupportedUnbewohnbar: PruefenCondition = (context) => {
  const supported = ["imBau", "verfallen"];
  return !!(
    isUnbewohnbar(context) &&
    context?.gebaeudeArtUnbewohnbar?.gebaeude &&
    !supported.includes(context.gebaeudeArtUnbewohnbar.gebaeude)
  );
};

const isUnsupportedUnbebaut: PruefenCondition = (context) => {
  const supported = ["baureif", "acker", "garten"];
  return !!(
    isUnbebaut(context) &&
    context?.gebaeudeArtUnbebaut?.art &&
    !supported.includes(context.gebaeudeArtUnbebaut.art)
  );
};

export const pruefenConditions = {
  isPrivatperson,
  isEigentuemer,
  isBundesmodelBundesland,
  isBewohnbar,
  isUnbewohnbar,
  isEligibleGebaeudeArtBewohnbar,
  isEligibleGebaeudeArtUnbewohnbar,
  isEligibleGebaeudeArtUnbebaut,
  isNotAusland,
  isNotFremderBoden,
  isNotBeguenstigung,
  isHof,
  isAckerOrGarten,
  isPrivatBebaut,
  isPrivatUnbebaut,
  isWirtschaftlichUnbebaut,
  isUnsupportedBewohnbar,
  isUnsupportedUnbewohnbar,
  isUnsupportedUnbebaut,
  isSupportedGrundstueckArt,
};
