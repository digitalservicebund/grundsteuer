import { GrundModel } from "./steps";
import { ConditionPredicate, AnyEventObject } from "xstate";
import { StateMachineContext } from "~/domain/states";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundModel, AnyEventObject> | any
>;

const zweifamilienhaus = () => {
  // TODO implement in STL-1852
  return false;
};

const bezugsfertigAb1949 = (context: StateMachineContext) => {
  return (
    showGebaeude(context) && context?.gebaeude?.ab1949?.isAb1949 === "true"
  );
};

const isKernsaniert = (context: StateMachineContext) => {
  return (
    showGebaeude(context) &&
    context?.gebaeude?.kernsaniert?.isKernsaniert === "true"
  );
};

const hasWeitereWohnraeume = (context: StateMachineContext) => {
  return (
    showGebaeude(context) &&
    context?.gebaeude?.weitereWohnraeume?.hasWeitereWohnraeume === "true"
  );
};

const hasGaragen = (context: StateMachineContext) => {
  return (
    showGebaeude(context) && context?.gebaeude?.garagen?.hasGaragen === "true"
  );
};

const anzahlEigentuemerIsTwo = (context: StateMachineContext) => {
  return context?.eigentuemer?.anzahl?.anzahl === "2";
};

const multipleEigentuemer = (context: StateMachineContext) => {
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

const repeatFlurstueck = (context: StateMachineContext) => {
  return (
    (context?.flurstueckId || 1) < Number(context?.grundstueck?.anzahl?.anzahl)
  );
};

const showGebaeude = (context: StateMachineContext) => {
  const typ = context?.grundstueck?.typ?.typ;
  return typ ? typ !== "abweichendeEntwicklung" : false;
};

const isUnbebaut = (context: StateMachineContext) => {
  return context?.grundstueck?.typ?.typ === "abweichendeEntwicklung";
};

const personIdGreaterThanOne = (context: StateMachineContext) => {
  return Number(context?.personId) > 1;
};

const flurstueckIdGreaterThanOne = (context: StateMachineContext) => {
  return Number(context?.flurstueckId) > 1;
};

export const conditions: Conditions = {
  bezugsfertigAb1949,
  isKernsaniert,
  zweifamilienhaus,
  hasWeitereWohnraeume,
  hasGaragen,
  anzahlEigentuemerIsTwo,
  multipleEigentuemer,
  hasGesetzlicherVertreter,
  repeatPerson,
  repeatFlurstueck,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context: any) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  showGebaeude,
  isUnbebaut,
  personIdGreaterThanOne,
  flurstueckIdGreaterThanOne,
};
