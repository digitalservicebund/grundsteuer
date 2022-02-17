import { GrundDataModelData } from "./model";
import { ConditionPredicate, AnyEventObject } from "xstate";
import { StateMachineContext } from "~/domain/steps";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundDataModelData, AnyEventObject> | any
>;

const hasGesetzlicherVertreter = (context: StateMachineContext) => {
  const person = context?.eigentuemer?.person[(context.currentId || 1) - 1];
  if (!person) return false;

  const gesetzlicherVertreter = person.gesetzlicherVertreter;
  if (!gesetzlicherVertreter) return false;

  const value = gesetzlicherVertreter.gesvertreter;
  if (!value) return false;

  if (value !== "true") return false;

  return true;
};

const repeatPerson = (context: StateMachineContext) => {
  return (context.currentId || 1) < parseInt(context.eigentuemer.anzahl.anzahl);
};

const showGebaeude = (context: StateMachineContext) => {
  return context.grundstueck.bebaut === "ja";
};

export const conditions: Conditions = {
  hasGesetzlicherVertreter,
  repeatPerson,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context: any) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
  showGebaeude,
};
