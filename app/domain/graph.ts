import { GrundDataModelData } from "~/domain/model";
import { createMachine } from "xstate";
import { conditions } from "~/domain/conditions";
import { actions } from "~/domain/actions";
import { getMachineConfig } from "~/domain/steps";
import { getShortestPaths } from "@xstate/graph";
import _ from "lodash";

/*
 * create a graph representation "hash"/"object" of the current state
 * usable for overview page or navigation
 */
export const createGraph = ({
  machineContext,
  getStepData,
}: {
  machineContext: GrundDataModelData;
  getStepData: (arg0: string) => any;
}) => {
  const machine = createMachine(getMachineConfig(machineContext) as any, {
    guards: conditions,
    actions: actions,
  });

  const paths = Object.values(getShortestPaths(machine));

  const list = paths.map((v) => {
    const state = v.state;
    const stateNode = state.configuration[0];
    const path: string = state.toStrings().at(-1) || "";
    let pathWithId = path;
    if (state.matches("eigentuemer.person")) {
      const currentId = (state.context as any).currentId || 1;
      pathWithId = pathWithId.replace(/\.person\./, `.person.${currentId}.`);
    }
    const data = getStepData(pathWithId);
    const meta = JSON.stringify(stateNode.meta?.stepDefinition, null, 2);

    return { path, pathWithId, data, meta };
  });

  console.log(JSON.stringify(list, null, 2));

  const graph = list.reduce((acc, item) => {
    return _.set(acc, item.pathWithId, item);
  }, {});

  return graph;
};
