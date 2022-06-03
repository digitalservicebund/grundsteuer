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
        NEXT: [
          { target: "bundesland", cond: "isNoErbengemeinschaft" },
          { target: "keineNutzung" },
        ],
      },
    },
    bundesland: {
      on: {
        BACK: { target: "erbengemeinschaft" },
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
          { target: "garagen", cond: "isEligibleGrundstueckArt" },
          { target: "keineNutzung" },
        ],
      },
    },
    garagen: {
      on: {
        BACK: { target: "grundstueckArt" },
        NEXT: [
          { target: "ausland", cond: "isEligibleGarage" },
          { target: "keineNutzung" },
        ],
      },
    },
    ausland: {
      on: {
        BACK: { target: "garagen" },
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
          { target: "elster", cond: "isNotBeguenstigung" },
          { target: "keineNutzung" },
        ],
      },
    },
    elster: {
      on: {
        BACK: { target: "beguenstigung" },
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
