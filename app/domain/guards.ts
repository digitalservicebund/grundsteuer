import { GrundModel } from "./steps";
import { ConditionPredicate, AnyEventObject } from "xstate";
import { StateMachineContext } from "~/domain/states";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundModel, AnyEventObject> | any
>;

const anzahlEigentuemerIsTwo = (context: StateMachineContext) => {
  return context?.eigentuemer?.anzahl?.anzahl === "2";
};

const multipleEigentuemer = (context: StateMachineContext) => {
  return Number(context?.eigentuemer?.anzahl?.anzahl) > 1;
};

const hasGesetzlicherVertreter = (context: StateMachineContext) => {
  const person = context?.eigentuemer?.person?.[(context?.currentId || 1) - 1];
  if (!person) return false;

  const gesetzlicherVertreter = person.gesetzlicherVertreter;
  if (!gesetzlicherVertreter) return false;

  const value = gesetzlicherVertreter.hasVertreter;
  return value === "true";
};

const repeatPerson = (context: StateMachineContext) => {
  return (
    (context?.currentId || 1) < Number(context?.eigentuemer?.anzahl?.anzahl)
  );
};

const showGebaeude = (context: StateMachineContext) => {
  return context?.grundstueck?.bebaut === "true";
};

export const conditions: Conditions = {
  anzahlEigentuemerIsTwo,
  multipleEigentuemer,
  hasGesetzlicherVertreter,
  repeatPerson,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context: any) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  showGebaeude,
};
