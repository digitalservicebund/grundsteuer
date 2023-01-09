import { createMachine, MachineConfig } from "xstate";
import { PruefenModel } from "~/domain/pruefen/model";
import { createGraph, getReachablePaths, Graph } from "~/domain";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { EventObject } from "xstate/lib/types";

export interface PruefenMachineContext extends PruefenModel {
  testFeaturesEnabled?: boolean;
}

export const pruefenStates: MachineConfig<PruefenModel, any, EventObject> = {
  id: "steps",
  initial: "bundesland",
  states: {
    bundesland: {
      on: {
        NEXT: [
          { target: "bewohnbar", cond: "isBundesmodelBundesland" },
          { target: "keineNutzung" },
        ],
      },
    },
    bewohnbar: {
      on: {
        BACK: { target: "bundesland" },
        NEXT: [
          { target: "gebaeudeArtBewohnbar", cond: "isBewohnbar" },
          { target: "gebaeudeArtUnbewohnbar", cond: "isUnbewohnbar" },
          { target: "gebaeudeArtUnbebaut" },
        ],
      },
    },
    gebaeudeArtBewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "nutzungsart", cond: "isHof" },
          { target: "fremderBoden", cond: "isEligibleGebaeudeArtBewohnbar" },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "fremderBoden", cond: "isEligibleGebaeudeArtUnbewohnbar" },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbebaut: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "fremderBoden", cond: "isEligibleGebaeudeArtUnbebaut" },
          { target: "keineNutzung" },
        ],
      },
    },
    nutzungsart: {
      on: {
        BACK: { target: "gebaeudeArtBewohnbar" },
        NEXT: [
          { target: "fremderBoden", cond: "isNotWirtschaftlich" },
          { target: "mehrereErklaerungen" },
        ],
      },
    },
    fremderBoden: {
      on: {
        BACK: [
          { target: "nutzungsart", cond: "isNotWirtschaftlich" },
          {
            target: "gebaeudeArtUnbebaut",
            cond: "isEligibleGebaeudeArtUnbebaut",
          },
          {
            target: "gebaeudeArtUnbewohnbar",
            cond: "isEligibleGebaeudeArtUnbewohnbar",
          },
          { target: "gebaeudeArtBewohnbar" },
        ],
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
          {
            target: "abgeber",
            cond: "isNotBeguenstigung",
          },
          { target: "keineNutzung" },
        ],
      },
    },
    abgeber: {
      on: {
        BACK: { target: "beguenstigung" },
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
        BACK: { target: "abgeber" },
        NEXT: [
          { target: "ausland", cond: "isPrivatperson" },
          {
            target: "keineNutzung",
          },
        ],
      },
    },
    ausland: {
      on: {
        BACK: { target: "eigentuemerTyp" },
        NEXT: [
          { target: "nutzung", cond: "isNotAusland" },
          { target: "keineNutzung" },
        ],
      },
    },
    mehrereErklaerungen: {
      type: "final",
      on: {
        BACK: [{ target: "beguenstigung" }],
      },
    },
    keineNutzung: {
      type: "final",
    },
    nutzung: {
      type: "final",
      on: {
        BACK: [{ target: "ausland" }],
      },
    },
  },
};

export const pruefenStatesLegacy: MachineConfig<
  PruefenModel,
  any,
  EventObject
> = {
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
          { target: "bewohnbar", cond: "showTestFeaturesAndBundesmodel" },
          { target: "grundstueckArt", cond: "isBundesmodelBundesland" },
          { target: "keineNutzung" },
        ],
      },
    },
    bewohnbar: {
      on: {
        BACK: { target: "bundesland" },
        NEXT: [
          { target: "gebaeudeArtBewohnbar", cond: "isBewohnbar" },
          { target: "gebaeudeArtUnbewohnbar", cond: "isUnbewohnbar" },
          { target: "gebaeudeArtUnbebaut" },
        ],
      },
    },
    gebaeudeArtBewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "ausland", cond: "isEligibleGebaeudeArtBewohnbar" },
          { target: "mehrereErklaerungen", cond: "isLufGebaeudeArtBewohnbar" },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "ausland", cond: "isEligibleGebaeudeArtUnbewohnbar" },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbebaut: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "ausland", cond: "isEligibleGebaeudeArtUnbebaut" },
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
        BACK: [
          { target: "gebaeudeArtBewohnbar", cond: "isBewohnbar" },
          { target: "gebaeudeArtUnbewohnbar", cond: "isUnbewohnbar" },
          {
            target: "gebaeudeArtUnbebaut",
            cond: "showTestFeaturesAndBundesmodel",
          },
          { target: "grundstueckArt" },
        ],
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
          {
            target: "nutzung",
            cond: "isNotBeguenstigung",
          },
          {
            target: "nutzung",
            cond: "isNotBeguenstigung",
          },
          { target: "keineNutzung" },
        ],
      },
    },
    mehrereErklaerungen: {
      type: "final",
      on: {
        BACK: [{ target: "beguenstigung" }],
      },
    },
    keineNutzung: {
      type: "final",
    },
    nutzung: {
      type: "final",
      on: {
        BACK: [{ target: "beguenstigung" }],
      },
    },
  },
};

export type PruefenMachineConfig =
  | typeof pruefenStatesLegacy
  | typeof pruefenStates;

export const getPruefenConfig = (context: PruefenMachineContext) => {
  return Object.assign(
    {},
    context.testFeaturesEnabled ? pruefenStates : pruefenStatesLegacy,
    { context: context }
  );
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

export const getReachablePathsFromPruefenData = (
  data: PruefenMachineContext
) => {
  const graph = createPruefenGraph({
    machineContext: data,
  });
  return getReachablePaths({ graph, initialPaths: [] });
};
