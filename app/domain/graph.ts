import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import _ from "lodash";
import { getStepData } from "~/domain/model";
import { conditions } from "~/domain/guards";
import { actions } from "~/domain/actions";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { getPathsFromState } from "~/util/getPathsFromState";
import { GrundModel } from "~/domain/steps";

type GraphChildElement = {
  path: string;
  pathWithId: string;
  data: Partial<GrundModel>;
};

export type Graph = {
  [index: string]: Graph | GraphChildElement | Graph[];
};

/*
 * create a graph representation "hash"/"object" of the current state
 * usable for overview page or navigation
 */
export const createGraph = ({
  machineContext,
}: {
  machineContext: StateMachineContext;
}): Graph => {
  const machine = createMachine(getMachineConfig(machineContext), {
    guards: conditions,
    actions: actions,
  });

  const paths = Object.values(getShortestPaths(machine));

  const list = paths.map((v) => {
    const { path, pathWithId } = getPathsFromState({ state: v.state });
    const data = getStepData(machineContext, pathWithId);
    return { path, pathWithId, data };
  });

  return list.reduce((acc, item) => {
    return _.set(acc, item.pathWithId, item);
  }, {});
};

export const getReachablePathsFromData = (data: GrundModel) => {
  const graph = createGraph({
    machineContext: data,
  });
  return getReachablePaths({ graph, initialPaths: [] });
};

export const getReachablePaths = ({
  graph,
  initialPaths,
}: {
  graph: Graph;
  initialPaths: Array<string>;
}): Array<string> => {
  let paths = initialPaths;
  Object.values(graph).forEach((v) => {
    if ((v as GraphChildElement).pathWithId) {
      paths.push((v as GraphChildElement).pathWithId);
    } else {
      paths = getReachablePaths({ graph: v as Graph, initialPaths: paths });
    }
  });
  return paths;
};
