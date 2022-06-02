import { createMachine, StateMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import _ from "lodash";
import { getStepData, idToIndex } from "~/domain/model";
import { conditions } from "~/domain/guards";
import { actions } from "~/domain/actions";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { getPathsFromState } from "~/util/getPathsFromState";
import { GrundModel } from "~/domain/steps";
import { PruefenModel } from "~/domain/pruefen/model";
import { PruefenMachineContext } from "~/domain/pruefen/states";
import { EventObject, StateSchema } from "xstate/lib/types";

export type GraphChildElement = {
  path: string;
  pathWithId: string;
  data: Partial<GrundModel>;
};

export type Graph = {
  [index: string]: Graph | GraphChildElement | Graph[];
};

export const createFormGraph = ({
  machineContext,
}: {
  machineContext: StateMachineContext;
}): Graph => {
  const machine = createMachine(getMachineConfig(machineContext), {
    guards: conditions,
    actions: actions,
  });

  return createGraph({ machine, machineContext });
};

/*
 * create a graph representation "hash"/"object" of the current state
 * usable for overview page or navigation
 */
export const createGraph = ({
  machine,
  machineContext,
}: {
  machine: StateMachine<
    StateMachineContext | PruefenMachineContext,
    StateSchema,
    EventObject
  >;
  machineContext: GrundModel | PruefenModel;
}): Graph => {
  const paths = Object.values(getShortestPaths(machine));

  const list = paths.map((v) => {
    const { path, pathWithId } = getPathsFromState({ state: v.state });
    const data = getStepData(machineContext, pathWithId);
    return { path, pathWithId, data };
  });

  return list.reduce((acc, item) => {
    return _.set(acc, idToIndex(item.pathWithId), item);
  }, {});
};

export const getReachablePathsFromGrundData = (data: GrundModel) => {
  const graph = createFormGraph({
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
