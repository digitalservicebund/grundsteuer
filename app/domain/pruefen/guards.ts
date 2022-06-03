import { PruefenMachineContext } from "~/domain/pruefen/states";

export type PruefenCondition = (
  context: PruefenMachineContext | undefined
) => boolean;
export type PruefenConditions = Record<string, PruefenCondition>;

const isPrivatperson: PruefenCondition = (context) => {
  return context?.eigentuemerTyp?.eigentuemerTyp == "privatperson";
};

const isNoErbengemeinschaft: PruefenCondition = (context) => {
  return (
    context?.erbengemeinschaft?.isErbengemeinschaft == "noErbengemeinschaft" ||
    context?.erbengemeinschaft?.isErbengemeinschaft ==
      "erbengemeinschaftInGrundbuch"
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

const isEligibleGrundstueckArt: PruefenCondition = (context) => {
  const eligibleGrundstueckArten = [
    "einfamilienhaus",
    "zweifamilienhaus",
    "eigentumswohnung",
    "mehrereGebaeude",
    "unbebaut",
  ];
  return !!(
    context?.grundstueckArt?.grundstueckArt &&
    eligibleGrundstueckArten.includes(context.grundstueckArt.grundstueckArt)
  );
};

const isEligibleGarage: PruefenCondition = (context) => {
  const eligibleGaragen = ["garageAufGrundstueck", "keine"];
  return !!(
    context?.garagen?.garagen &&
    eligibleGaragen.includes(context.garagen.garagen)
  );
};

const isNotAusland: PruefenCondition = (context) => {
  return context?.ausland?.ausland == "false";
};

const isNotFremderBoden: PruefenCondition = (context) => {
  return context?.fremderBoden?.fremderBoden == "false";
};

const isNotBeguenstigung: PruefenCondition = (context) => {
  return context?.beguenstigung?.beguenstigung == "false";
};

const hasNoElster: PruefenCondition = (context) => {
  return context?.elster?.elster == "false";
};

export const pruefenConditions: PruefenConditions = {
  isPrivatperson,
  isNoErbengemeinschaft,
  isBundesmodelBundesland,
  isEligibleGrundstueckArt,
  isEligibleGarage,
  isNotAusland,
  isNotFremderBoden,
  isNotBeguenstigung,
  hasNoElster,
};
