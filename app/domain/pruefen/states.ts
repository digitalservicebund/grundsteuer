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
          { target: "erbengemeinschaft", cond: "isPrivatperson" },
          {
            target: "keineNutzung",
          },
        ],
      },
    },
    erbengemeinschaft: {
      on: {
        BACK: { target: "eigentuemerTyp" },
        NEXT: [{ target: "bundesland" }],
      },
    },
    bundesland: {
      on: {
        BACK: { target: "erbengemeinschaft" },
        NEXT: [{ target: "grundstueckArt" }],
      },
    },
    grundstueckArt: {
      on: {
        BACK: { target: "bundesland" },
        NEXT: [{ target: "garagen" }],
      },
    },
    garagen: {
      on: {
        BACK: { target: "grundstueckArt" },
        NEXT: [{ target: "ausland" }],
      },
    },
    ausland: {
      on: {
        BACK: { target: "garagen" },
        NEXT: [{ target: "fremderBoden" }],
      },
    },
    fremderBoden: {
      on: {
        BACK: { target: "ausland" },
        NEXT: [{ target: "beguenstigung" }],
      },
    },
    beguenstigung: {
      on: {
        BACK: { target: "fremderBoden" },
        NEXT: [{ target: "elster" }],
      },
    },
    elster: {
      on: {
        BACK: { target: "beguenstigung" },
        NEXT: [{ target: "nutzung" }],
      },
    },
    keineNutzung: {
      type: "final",
    },
    nutzung: {
      type: "final",
    },
    spaeterNutzung: {
      type: "final",
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
