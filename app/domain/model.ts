import _ from "lodash";
import type { GrundModel } from "~/domain/steps";
import { getReachablePathsFromData } from "~/domain/graph";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

export const idToIndex = (path: string) => {
  return path
    .split(".")
    .map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s))
    .join(".");
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

  const reachablePaths = getReachablePathsFromData(completeData);
  reachablePaths.forEach((path) => {
    const pathData = _.get(completeData, idToIndex(path));
    if (pathData) {
      _.set(filteredData, idToIndex(path), pathData);
    }
  });

  return filteredData;
};
