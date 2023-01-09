import { PruefenMachineContext } from "~/domain/pruefen/states.server";

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
  return context?.testFeaturesEnabled
    ? !!(
        context?.abgeber?.abgeber &&
        eligibleEigentuemerArten.includes(context?.abgeber?.abgeber)
      )
    : !!(
        context?.start?.abgeber &&
        eligibleEigentuemerArten.includes(context?.start?.abgeber)
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
  return !!(context?.testFeaturesEnabled && isBundesmodelBundesland(context));
};

const isBewohnbar: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar == "bewohnbar";
};

const isUnbewohnbar: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar == "unbewohnbar";
};

const isUnbebaut: PruefenCondition = (context) => {
  return context?.bewohnbar?.bewohnbar == "unbebaut";
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
  return isUnbebaut(context) && context?.gebaeudeArtUnbebaut?.art == "baureif";
};

const isLufGebaeudeArtBewohnbar: PruefenCondition = (context) => {
  return context?.gebaeudeArtBewohnbar?.gebaeude == "hof";
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

const isHof: PruefenCondition = (context) => {
  return (
    isBewohnbar(context) && context?.gebaeudeArtBewohnbar?.gebaeude === "hof"
  );
};

const isNotWirtschaftlich: PruefenCondition = (context) => {
  return (
    isBewohnbar(context) &&
    isHof(context) &&
    context?.nutzungsart?.wirtschaftlich === "false"
  );
};

export const pruefenConditions: PruefenConditions = {
  isPrivatperson,
  isEigentuemer,
  isBundesmodelBundesland,
  showTestFeaturesAndBundesmodel,
  isBewohnbar,
  isUnbewohnbar,
  isEligibleGebaeudeArtBewohnbar,
  isEligibleGebaeudeArtUnbewohnbar,
  isEligibleGebaeudeArtUnbebaut,
  isLufGebaeudeArtBewohnbar,
  isEligibleGrundstueckArt,
  isNotAusland,
  isNotFremderBoden,
  isNotBeguenstigung,
  isHof,
  isNotWirtschaftlich,
};
