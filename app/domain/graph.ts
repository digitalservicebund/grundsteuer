import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";
import _ from "lodash";
import { getStepData } from "~/domain/model";
import { conditions } from "~/domain/guards";
import { actions } from "~/domain/actions";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { getPathsFromState } from "~/util/getPathsFromState";

/*
 * create a graph representation "hash"/"object" of the current state
 * usable for overview page or navigation
 */
export const createGraph = ({
  machineContext,
}: {
  machineContext: StateMachineContext;
}) => {
  const machine = createMachine(getMachineConfig(machineContext), {
    guards: conditions,
    actions: actions,
  });

  const paths = Object.values(getShortestPaths(machine));

  const list = paths.map((v) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { path, pathWithId } = getPathsFromState(v.state as any);
    const data = getStepData(machineContext, pathWithId);
    return { path, pathWithId, data };
  });

  return list.reduce((acc, item) => {
    return _.set(acc, item.pathWithId, item);
  }, {});
};
