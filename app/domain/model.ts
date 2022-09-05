import _ from "lodash";
import type { GrundModel } from "~/domain/steps/index.server";
import { getReachablePathsFromGrundData } from "~/domain/states/graph.server";
import { PruefenModel } from "~/domain/pruefen/model";
import { StateMachineContext } from "~/domain/states/states.server";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

export const idToIndex = (path: string) => {
  return path
    .split(".")
    .map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s))
    .join(".");
};

export const setStepData = (
  data: GrundModel | PruefenModel,
  path: string,
  values: StepFormData
) => {
  return _.set(_.cloneDeep(data), idToIndex(path), values);
};

export const getStepData = (data: GrundModel | PruefenModel, path: string) => {
  return _.get(data, idToIndex(path));
};

export const filterDataForReachablePaths = (
  completeData: StateMachineContext
): GrundModel => {
  const filteredData = {};

  const reachablePaths = getReachablePathsFromGrundData(completeData);
  reachablePaths.forEach((path) => {
    const pathData = _.get(completeData, idToIndex(path));
    _.set(filteredData, idToIndex(path), pathData);
  });

  return filteredData;
};
