import { createMachine, MachineConfig } from "xstate";
import { PruefenModel } from "~/domain/pruefen/model";
import { createGraph, getReachablePaths, Graph } from "~/domain";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { EventObject } from "xstate/lib/types";

export type PruefenMachineContext = PruefenModel;

export const pruefenStates: MachineConfig<PruefenModel, any, EventObject> = {
  id: "steps",
  initial: "start",
  states: {
    start: {
      on: {
        NEXT: [
          { target: "eigentuemerTyp", cond: "isEigentuemer" },
          {
            target: "keineNutzung",
          },
        ],
      },
    },
    eigentuemerTyp: {
      on: {
        BACK: { target: "start" },
        NEXT: [
          { target: "bundesland", cond: "isPrivatperson" },
          {
            target: "keineNutzung",
          },
        ],
      },
    },
    bundesland: {
      on: {
        BACK: { target: "eigentuemerTyp" },
        NEXT: [
          { target: "grundstueckArt", cond: "isBundesmodelBundesland" },
          { target: "keineNutzung" },
        ],
      },
    },
    grundstueckArt: {
      on: {
        BACK: { target: "bundesland" },
        NEXT: [
          { target: "ausland", cond: "isEligibleGrundstueckArt" },
          { target: "keineNutzung" },
        ],
      },
    },
    ausland: {
      on: {
        BACK: { target: "grundstueckArt" },
        NEXT: [
          { target: "fremderBoden", cond: "isNotAusland" },
          { target: "keineNutzung" },
        ],
      },
    },
    fremderBoden: {
      on: {
        BACK: { target: "ausland" },
        NEXT: [
          { target: "beguenstigung", cond: "isNotFremderBoden" },
          { target: "keineNutzung" },
        ],
      },
    },
    beguenstigung: {
      on: {
        BACK: { target: "fremderBoden" },
        NEXT: [
          { target: "garagen", cond: "isNotBeguenstigung" },
          { target: "keineNutzung" },
        ],
      },
    },
    garagen: {
      on: {
        BACK: { target: "beguenstigung" },
        NEXT: [
          { target: "elster", cond: "isEligibleGarage" },
          { target: "spaeterNutzung" },
        ],
      },
    },
    elster: {
      on: {
        BACK: { target: "garagen" },
        NEXT: [
          { target: "nutzung", cond: "hasNoElster" },
          { target: "spaeterNutzung" },
        ],
      },
    },
    keineNutzung: {
      type: "final",
    },
    nutzung: {
      type: "final",
      on: {
        BACK: { target: "elster" },
      },
    },
    spaeterNutzung: {
      type: "final",
    },
  },
};

export type PruefenMachineConfig = typeof pruefenStates;

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
