import { GrundModel } from "./steps";
import { ConditionPredicate, AnyEventObject } from "xstate";
import { StateMachineContext } from "~/domain/states";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundModel, AnyEventObject> | any
>;

const isZweifamilienhaus = (context: StateMachineContext) => {
  return context?.grundstueck?.typ?.typ === "zweifamilienhaus";
};

const isBezugsfertigAb1949 = (context: StateMachineContext) => {
  return isBebaut(context) && context?.gebaeude?.ab1949?.isAb1949 === "true";
};

const isKernsaniert = (context: StateMachineContext) => {
  return (
    isBebaut(context) &&
    context?.gebaeude?.kernsaniert?.isKernsaniert === "true"
  );
};

const hasAbbruchverpflichtung = (context: StateMachineContext) => {
  return (
    isBebaut(context) &&
    context.gebaeude?.abbruchverpflichtung?.hasAbbruchverpflichtung === "true"
  );
};

const hasWeitereWohnraeume = (context: StateMachineContext) => {
  return (
    isBebaut(context) &&
    context?.gebaeude?.weitereWohnraeume?.hasWeitereWohnraeume === "true"
  );
};

const hasGaragen = (context: StateMachineContext) => {
  return isBebaut(context) && context?.gebaeude?.garagen?.hasGaragen === "true";
};

const anzahlEigentuemerIsTwo = (context: StateMachineContext) => {
  return context?.eigentuemer?.anzahl?.anzahl === "2";
};

const isBruchteilsgemeinschaft = (context: StateMachineContext) => {
  return (
    Number(context?.eigentuemer?.anzahl?.anzahl) > 2 ||
    (Number(context?.eigentuemer?.anzahl?.anzahl) == 2 &&
      context?.eigentuemer?.verheiratet?.areVerheiratet == "false")
  );
};

const customBruchteilsgemeinschaftData = (context: StateMachineContext) => {
  return (
    context?.eigentuemer?.bruchteilsgemeinschaft?.predefinedData == "false"
  );
};

const hasMultipleEigentuemer = (context: StateMachineContext) => {
  return Number(context?.eigentuemer?.anzahl?.anzahl) > 1;
};

const hasGesetzlicherVertreter = (context: StateMachineContext) => {
  const person = context?.eigentuemer?.person?.[(context?.personId || 1) - 1];
  if (!person) return false;

  const gesetzlicherVertreter = person.gesetzlicherVertreter;
  if (!gesetzlicherVertreter) return false;

  const value = gesetzlicherVertreter.hasVertreter;
  return value === "true";
};

const repeatPerson = (context: StateMachineContext) => {
  return (
    (context?.personId || 1) < Number(context?.eigentuemer?.anzahl?.anzahl)
  );
};

const hasEmpfangsbevollmaechtigter = (context: StateMachineContext) => {
  return (
    context?.eigentuemer?.empfangsvollmacht?.hasEmpfangsvollmacht == "true"
  );
};

const repeatFlurstueck = (context: StateMachineContext) => {
  return (
    (context?.flurstueckId || 1) < Number(context?.grundstueck?.anzahl?.anzahl)
  );
};

const isBebaut = (context: StateMachineContext) => {
  const typ = context?.grundstueck?.typ?.typ;
  return typ
    ? ["einfamilienhaus", "zweifamilienhaus", "wohnungseigentum"].includes(typ)
    : false;
};

const isAbweichendeEntwicklung = (context: StateMachineContext) => {
  return context?.grundstueck?.typ?.typ === "abweichendeEntwicklung";
};

const personIdGreaterThanOne = (context: StateMachineContext) => {
  return Number(context?.personId) > 1;
};

const flurstueckIdGreaterThanOne = (context: StateMachineContext) => {
  return Number(context?.flurstueckId) > 1;
};

export const conditions: Conditions = {
  isBezugsfertigAb1949,
  isKernsaniert,
  hasAbbruchverpflichtung,
  isZweifamilienhaus,
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
  hasNotGesetzlicherVertreterAndRepeatPerson: (
    context: StateMachineContext
  ) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  isBebaut,
  isAbweichendeEntwicklung,
  personIdGreaterThanOne,
  flurstueckIdGreaterThanOne,
};
