import { StateMachineContext } from "~/domain/states/states.server";

export type Condition = (context: StateMachineContext | undefined) => boolean;
export type Conditions = Record<string, Condition>;

const isEigentumswohnung: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.grundstueck?.haustyp?.haustyp === "wohnungseigentum"
  );
};

const isEinfamilienhaus: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.grundstueck?.haustyp?.haustyp === "einfamilienhaus"
  );
};

const isZweifamilienhaus: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.grundstueck?.haustyp?.haustyp === "zweifamilienhaus"
  );
};

const isWohnung: Condition = (context) => {
  return (
    isBebaut(context) &&
    context?.grundstueck?.haustyp?.haustyp === "wohnungseigentum"
  );
};

const isBebaut: Condition = (context) => {
  const bebautValue = context?.grundstueck?.bebaut?.bebaut;
  return !!bebautValue && ["bebaut"].includes(bebautValue);
};

const isUnbebautOhneHaus: Condition = (context) => {
  const bebautValue = context?.grundstueck?.bebaut?.bebaut;
  return !!bebautValue && ["unbebaut"].includes(bebautValue);
};

const isUnbebaut: Condition = (context) => {
  const bebautValue = context?.grundstueck?.bebaut?.bebaut;
  return !!bebautValue && ["baureif", "unbebaut"].includes(bebautValue);
};

const isHausOrUnbebaut: Condition = (context) => {
  return (
    isEinfamilienhaus(context) ||
    isZweifamilienhaus(context) ||
    isUnbebaut(context)
  );
};

// sondernutzung is treated like "none"
const wohnungHasMiteigentumNone: Condition = (context) => {
  if (!isWohnung(context)) return false;
  const miteigentumTyp =
    context?.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp;
  return miteigentumTyp === "none" || miteigentumTyp === "sondernutzung";
};

const wohnungHasMiteigentumGarage: Condition = (context) => {
  return (
    isWohnung(context) &&
    context?.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp === "garage"
  );
};

const wohnungHasMiteigentumMixed: Condition = (context) => {
  return (
    isWohnung(context) &&
    context?.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp === "mixed"
  );
};

const wohnungHasMiteigentumNoneOrGarage: Condition = (context) => {
  return (
    wohnungHasMiteigentumNone(context) || wohnungHasMiteigentumGarage(context)
  );
};

const hausHasMiteigentum: Condition = (context) => {
  return (
    isHausOrUnbebaut(context) &&
    context?.grundstueck?.miteigentumAuswahlHaus?.hasMiteigentum === "true"
  );
};

const grundstueckHasMiteigentum: Condition = (context) => {
  return hausHasMiteigentum(context) || wohnungHasMiteigentumMixed(context);
};

const flurstueckHasMiteigentum: Condition = (context) => {
  return (
    grundstueckHasMiteigentum(context) &&
    context?.grundstueck?.flurstueck?.[(context?.flurstueckId || 1) - 1]
      ?.miteigentumAuswahl?.hasMiteigentum === "true"
  );
};

export const previousFlurstueckHasMiteigentum: Condition = (context) => {
  if (!context?.flurstueckId || context?.flurstueckId == 1) return false;
  return (
    grundstueckHasMiteigentum(context) &&
    context?.grundstueck?.flurstueck?.[context?.flurstueckId - 2]
      ?.miteigentumAuswahl?.hasMiteigentum === "true"
  );
};

const grundstueckHasMiteigentumAndPreviousFlurstueckeExist: Condition = (
  context
) => {
  return (
    grundstueckHasMiteigentum(context) && flurstueckIdGreaterThanOne(context)
  );
};

const isNotWohnungOrHasMiteigentumWohnungMixed: Condition = (context) => {
  return !isWohnung(context) || wohnungHasMiteigentumMixed(context);
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

const personIdGreaterThanOne: Condition = (context) => {
  return Number(context?.personId) > 1;
};

const flurstueckIdGreaterThanOne: Condition = (context) => {
  return Number(context?.flurstueckId) > 1;
};

const bundeslandIsNW: Condition = (context) => {
  return context?.grundstueck?.adresse?.bundesland == "NW";
};

const isExplicitFlurstueckGrundbuchblattnummer: Condition = (context) => {
  const grundstuecktyp = context?.grundstueck?.haustyp?.haustyp;
  const miteigentumTyp =
    context?.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp;
  if (context?.grundstueck?.adresse?.bundesland == "NW") {
    return grundstuecktyp !== "wohnungseigentum" || miteigentumTyp === "mixed";
  }
  return false;
};

const isGrundstueckBundeslandKnown: Condition = (context) => {
  return context?.grundstueck?.adresse?.bundesland !== undefined;
};

export const conditions: Conditions = {
  isBezugsfertigAb1949,
  hausHasMiteigentum,
  wohnungHasMiteigentumNone,
  wohnungHasMiteigentumGarage,
  wohnungHasMiteigentumMixed,
  wohnungHasMiteigentumNoneOrGarage,
  grundstueckHasMiteigentum,
  flurstueckHasMiteigentum,
  previousFlurstueckHasMiteigentum,
  grundstueckHasMiteigentumAndPreviousFlurstueckeExist,
  isKernsaniert,
  hasAbbruchverpflichtung,
  isEigentumswohnung,
  isZweifamilienhaus,
  isUnbebaut,
  isUnbebautOhneHaus,
  isBebaut,
  isHausOrUnbebaut,
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
  personIdGreaterThanOne,
  flurstueckIdGreaterThanOne,
  bundeslandIsNW,
  isExplicitFlurstueckGrundbuchblattnummer,
  isGrundstueckBundeslandKnown,
  isNotWohnungOrHasMiteigentumWohnungMixed,
};
