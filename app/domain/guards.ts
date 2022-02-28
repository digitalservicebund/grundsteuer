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
  return context?.gebaeude?.ab1949?.isAb1949 === "true";
};

const isKernsaniert = (context: StateMachineContext) => {
  return context?.gebaeude?.kernsaniert?.isKernsaniert === "true";
};

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

const currentIdGreaterThanOne = (context: StateMachineContext) => {
  return Number(context?.currentId) > 1;
};

export const conditions: Conditions = {
  bezugsfertigAb1949,
  isKernsaniert,
  anzahlEigentuemerIsTwo,
  multipleEigentuemer,
  hasGesetzlicherVertreter,
  repeatPerson,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context: any) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  showGebaeude,
  currentIdGreaterThanOne,
};
