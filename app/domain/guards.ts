import { StateMachineContext } from "~/domain/states";

export type Condition = (context: StateMachineContext | undefined) => boolean;
export type Conditions = Record<string, Condition>;

const isEigentumswohnung: Condition = (context) => {
  return context?.grundstueck?.typ?.typ === "wohnungseigentum";
};

// TODO remove this and use isEigentumswohnung instead once miteigentum is on production
const isEigentumswohnungTest: Condition = (context) => {
  return !!(
    context?.testFeaturesEnabled &&
    context?.grundstueck?.typ?.typ === "wohnungseigentum"
  );
};

const isEinfamilienhaus: Condition = (context) => {
  return context?.grundstueck?.typ?.typ === "einfamilienhaus";
};

const isZweifamilienhaus: Condition = (context) => {
  return context?.grundstueck?.typ?.typ === "zweifamilienhaus";
};

const isUnbebaut: Condition = (context) => {
  return (
    context?.grundstueck?.typ?.typ === "baureif" ||
    context?.grundstueck?.typ?.typ === "abweichendeEntwicklung"
  );
};

const isHaus: Condition = (context) => {
  return !!(
    context?.testFeaturesEnabled &&
    (isEinfamilienhaus(context) ||
      isZweifamilienhaus(context) ||
      isUnbebaut(context))
  );
};

const hausMiteigentum: Condition = (context) => {
  return !!(
    context?.testFeaturesEnabled &&
    context?.grundstueck?.miteigentumAuswahlHaus?.hasMiteigentum === "true"
  );
};

const flurstueckMiteigentum: Condition = (context) => {
  return (
    context?.grundstueck?.flurstueck?.[(context?.flurstueckId || 1) - 1]
      .miteigentumAuswahl?.hasMiteigentum === "true"
  );
};

export const previousFlurstueckMiteigentum: Condition = (context) => {
  if (!context?.flurstueckId || context?.flurstueckId == 1) return false;
  return (
    context?.grundstueck?.flurstueck?.[context?.flurstueckId - 2]
      .miteigentumAuswahl?.hasMiteigentum === "true"
  );
};

const hausMiteigentumAndPreviousFlurstuecke: Condition = (context) => {
  return hausMiteigentum(context) && flurstueckIdGreaterThanOne(context);
};

const isBezugsfertigAb1949: Condition = (context) => {
  return isBebaut(context) && context?.gebaeude?.ab1949?.isAb1949 === "true";
};

const isKernsaniert: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.gebaeude?.kernsaniert?.isKernsaniert === "true"
  );
};

const hasAbbruchverpflichtung: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.gebaeude?.abbruchverpflichtung?.hasAbbruchverpflichtung === "true"
  );
};

const hasWeitereWohnraeume: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.gebaeude?.weitereWohnraeume?.hasWeitereWohnraeume === "true"
  );
};

const hasGaragen: Condition = (context) => {
  return isBebaut(context) && context?.gebaeude?.garagen?.hasGaragen === "true";
};

const anzahlEigentuemerIsTwo: Condition = (context) => {
  return context?.eigentuemer?.anzahl?.anzahl === "2";
};

const isBruchteilsgemeinschaft: Condition = (context) => {
  return (
    Number(context?.eigentuemer?.anzahl?.anzahl) > 2 ||
    (Number(context?.eigentuemer?.anzahl?.anzahl) == 2 &&
      context?.eigentuemer?.verheiratet?.areVerheiratet == "false")
  );
};

const customBruchteilsgemeinschaftData: Condition = (context) => {
  return (
    context?.eigentuemer?.bruchteilsgemeinschaft?.predefinedData == "false"
  );
};

const hasMultipleEigentuemer: Condition = (context) => {
  return Number(context?.eigentuemer?.anzahl?.anzahl) > 1;
};

const hasGesetzlicherVertreter: Condition = (context) => {
  const person = context?.eigentuemer?.person?.[(context?.personId || 1) - 1];
  if (!person) return false;

  const gesetzlicherVertreter = person.gesetzlicherVertreter;
  if (!gesetzlicherVertreter) return false;

  const value = gesetzlicherVertreter.hasVertreter;
  return value === "true";
};

const repeatPerson: Condition = (context) => {
  return (
    (context?.personId || 1) < Number(context?.eigentuemer?.anzahl?.anzahl)
  );
};

const hasEmpfangsbevollmaechtigter: Condition = (context) => {
  return (
    context?.eigentuemer?.empfangsvollmacht?.hasEmpfangsvollmacht == "true"
  );
};

const repeatFlurstueck: Condition = (context) => {
  return (
    (context?.flurstueckId || 1) < Number(context?.grundstueck?.anzahl?.anzahl)
  );
};

const isBebaut: Condition = (context) => {
  const typ = context?.grundstueck?.typ?.typ;
  return typ
    ? ["einfamilienhaus", "zweifamilienhaus", "wohnungseigentum"].includes(typ)
    : false;
};

const isAbweichendeEntwicklung: Condition = (context) => {
  return context?.grundstueck?.typ?.typ === "abweichendeEntwicklung";
};

const personIdGreaterThanOne: Condition = (context) => {
  return Number(context?.personId) > 1;
};

const flurstueckIdGreaterThanOne: Condition = (context) => {
  return Number(context?.flurstueckId) > 1;
};

const bundeslandIsNW: Condition = (context) => {
  return context?.grundstueck?.adresse?.bundesland == "NW";
};

export const conditions: Conditions = {
  isBezugsfertigAb1949,
  hausMiteigentum,
  flurstueckMiteigentum,
  previousFlurstueckMiteigentum,
  hausMiteigentumAndPreviousFlurstuecke,
  isKernsaniert,
  hasAbbruchverpflichtung,
  isEigentumswohnung,
  isEigentumswohnungTest,
  isZweifamilienhaus,
  isHaus,
  hasWeitereWohnraeume,
  hasGaragen,
  anzahlEigentuemerIsTwo,
  isBruchteilsgemeinschaft,
  customBruchteilsgemeinschaftData,
  hasMultipleEigentuemer,
  hasGesetzlicherVertreter,
  repeatPerson,
  hasEmpfangsbevollmaechtigter,
  repeatFlurstueck,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  isBebaut,
  isAbweichendeEntwicklung,
  personIdGreaterThanOne,
  flurstueckIdGreaterThanOne,
  bundeslandIsNW,
};
