import { GrundDataModelData } from "./model";
import { ConditionPredicate, AnyEventObject } from "xstate";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundDataModelData, AnyEventObject> | any
>;

export const conditions: Conditions = {
  isBebaut: (context: GrundDataModelData) => {
    if (!context || !context.legacy || !context.legacy.bebauung) return false;
    return context.legacy.bebauung.bebauung === "bebaut";
  },
  isUnbebaut: (context: GrundDataModelData) => {
    if (!context || !context.legacy || !context.legacy.bebauung) return false;
    return context.legacy.bebauung.bebauung === "unbebaut";
  },
};
