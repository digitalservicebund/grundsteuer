import { createMachine, MachineConfig } from "xstate";
import { PruefenModel } from "~/domain/pruefen/model";
import { createGraph, getReachablePaths, Graph } from "~/domain";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { EventObject } from "xstate/lib/types";
export type PruefenMachineContext = PruefenModel;

export const pruefenStates: MachineConfig<PruefenModel, any, EventObject> = {
  id: "steps",
  initial: "eigentuemerTyp",
  states: {
    eigentuemerTyp: {
      on: {
        NEXT: [
          {
            target: "failure",
            cond: "isNotPrivatperson",
          },
          { target: "erbengemeinschaft" },
        ],
      },
    },
    erbengemeinschaft: {
      on: {
        BACK: { target: "eigentuemerTyp" },
        NEXT: [{ target: "failure" }],
      },
    },
    failure: {
      type: "final",
      on: {
        BACK: [
          {
            target: "eigentuemerTyp",
            cond: "isNotPrivatperson",
          },
          { target: "erbengemeinschaft" },
        ],
      },
    },
  },
};

export const getPruefenConfig = (formData: PruefenMachineContext) => {
  return Object.assign({}, pruefenStates, { context: formData });
};

export const createPruefenGraph = ({
  machineContext,
}: {
  machineContext: PruefenMachineContext;
}): Graph => {
  const machine = createMachine(getPruefenConfig(machineContext), {
    guards: pruefenConditions,
  });

  return createGraph({ machine, machineContext });
};

export const getReachablePathsFromPruefenData = (data: PruefenModel) => {
  const graph = createPruefenGraph({
    machineContext: data,
  });
  return getReachablePaths({ graph, initialPaths: [] });
};
