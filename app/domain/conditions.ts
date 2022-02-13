import { GrundDataModelData } from "./model";
import { ConditionPredicate, AnyEventObject } from "xstate";

export type Conditions = Record<
  string,
  ConditionPredicate<GrundDataModelData, AnyEventObject> | any
>;

export const conditions: Conditions = {
  isBebaut: () => {
    return true;
  },
  isUnbebaut: () => {
    return true;
  },
};
