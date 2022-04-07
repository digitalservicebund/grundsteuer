import _ from "lodash";
import type { GrundModel } from "~/domain/steps";
import { createGraph, getReachablePaths } from "~/domain/graph";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

const idToIndex = (path: string) => {
  return path.split(".").map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s));
};

export const setStepData = (
  data: GrundModel,
  path: string,
  values: StepFormData
) => {
  return _.set(data, idToIndex(path), values);
};

export const getStepData = (data: GrundModel, path: string) => {
  return _.get(data, idToIndex(path));
};

export const filterDataForReachablePaths = (
  completeData: GrundModel
): GrundModel => {
  const filteredData = {};

  const graph = createGraph({
    machineContext: completeData,
  });
  const reachablePaths = getReachablePaths({ graph, initialPaths: [] });
  reachablePaths.forEach((path) => {
    const pathData = _.get(completeData, idToIndex(path));
    if (pathData) {
      _.set(filteredData, idToIndex(path), pathData);
    }
  });

  return filteredData;
};
