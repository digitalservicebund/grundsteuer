import { GrundDataModelData } from "./model";
import { ConditionPredicate, AnyEventObject } from "xstate";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundDataModelData, AnyEventObject> | any
>;

export const conditions: Conditions = {
  isBebaut: (context: GrundDataModelData) => {
    if (
      !context ||
      !context.sectionGrundstueck ||
      !context.sectionGrundstueck.bebauung
    )
      return false;
    return context.sectionGrundstueck.bebauung.bebauung === "bebaut";
  },
  isUnbebaut: (context: GrundDataModelData) => {
    if (
      !context ||
      !context.sectionGrundstueck ||
      !context.sectionGrundstueck.bebauung
    )
      return false;
    return context.sectionGrundstueck.bebauung.bebauung === "unbebaut";
  },
};
