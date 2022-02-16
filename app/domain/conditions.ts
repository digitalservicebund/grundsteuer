import { GrundDataModelData } from "./model";
import { ConditionPredicate, AnyEventObject } from "xstate";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundDataModelData, AnyEventObject> | any
>;

const hasGesetzlicherVertreter = (context: any) => {
  console.log(
    "hasGesetzlicherVertreter",
    context.eigentuemer.person,
    context.currentId
  );

  const person = context?.eigentuemer?.person[context.currentId - 1];
  if (!person) return false;

  const gesetzlicherVertreter = person.gesetzlicherVertreter;
  if (!gesetzlicherVertreter) return false;

  const value = gesetzlicherVertreter.gesvertreter;
  if (!value) return false;

  if (value !== "true") return false;

  return true;
};

const repeatPerson = (context: any) => {
  console.log(context.eigentuemer);
  return (context.currentId || 1) < parseInt(context.eigentuemer.anzahl.anzahl);
};

export const conditions: Conditions = {
  isBebaut: () => {
    return true;
  },
  isUnbebaut: () => {
    return true;
  },
  hasGesetzlicherVertreter,
  repeatPerson,
  hasNotGesetzlicherVertreterAndRepeatPerson: (context: any) => {
    return !hasGesetzlicherVertreter(context) && repeatPerson(context);
  },
};
