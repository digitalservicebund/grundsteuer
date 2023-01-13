import { createMachine, MachineConfig } from "xstate";
import { PruefenModel } from "~/domain/pruefen/model";
import { createGraph, getReachablePaths, Graph } from "~/domain";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { EventObject } from "xstate/lib/types";
import { negate } from "lodash";

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
          {
            target: "gebaeudeArtBewohnbar",
            cond: pruefenConditions.isBewohnbar,
          },
          {
            target: "gebaeudeArtUnbewohnbar",
            cond: pruefenConditions.isUnbewohnbar,
          },
          { target: "gebaeudeArtUnbebaut" },
        ],
      },
    },
    gebaeudeArtBewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          { target: "nutzungsartBebaut", cond: pruefenConditions.isHof },
          {
            target: "fremderBoden",
            cond: pruefenConditions.isEligibleGebaeudeArtBewohnbar,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbewohnbar: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          {
            target: "fremderBoden",
            cond: pruefenConditions.isEligibleGebaeudeArtUnbewohnbar,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    gebaeudeArtUnbebaut: {
      on: {
        BACK: { target: "bewohnbar" },
        NEXT: [
          {
            target: "nutzungsartUnbebaut",
            cond: pruefenConditions.isAckerOrGarten,
          },
          {
            target: "fremderBoden",
            cond: pruefenConditions.isEligibleGebaeudeArtUnbebaut,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    nutzungsartBebaut: {
      on: {
        BACK: { target: "gebaeudeArtBewohnbar" },
        NEXT: [
          {
            target: "fremderBoden",
            cond: pruefenConditions.isPrivatBebaut,
          },
          { target: "mehrereErklaerungen" },
        ],
      },
    },
    nutzungsartUnbebaut: {
      on: {
        BACK: { target: "gebaeudeArtUnbebaut" },
        NEXT: [
          {
            target: "fremderBoden",
            cond: pruefenConditions.isPrivatUnbebaut,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    fremderBoden: {
      on: {
        BACK: [
          {
            target: "nutzungsartBebaut",
            cond: pruefenConditions.isPrivatBebaut,
          },
          {
            target: "nutzungsartUnbebaut",
            cond: pruefenConditions.isPrivatUnbebaut,
          },
          {
            target: "gebaeudeArtUnbebaut",
            cond: pruefenConditions.isEligibleGebaeudeArtUnbebaut,
          },
          {
            target: "gebaeudeArtUnbewohnbar",
            cond: pruefenConditions.isEligibleGebaeudeArtUnbewohnbar,
          },
          { target: "gebaeudeArtBewohnbar" },
        ],
        NEXT: [
          {
            target: "beguenstigung",
            cond: pruefenConditions.isNotFremderBoden,
          },
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
            cond: pruefenConditions.isNotBeguenstigung,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    abgeber: {
      on: {
        BACK: { target: "beguenstigung" },
        NEXT: [
          { target: "eigentuemerTyp", cond: pruefenConditions.isEigentuemer },
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
          { target: "ausland", cond: pruefenConditions.isPrivatperson },
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
          { target: "nutzung", cond: pruefenConditions.isNotAusland },
          { target: "keineNutzung" },
        ],
      },
    },
    mehrereErklaerungen: {
      type: "final",
      on: {
        BACK: [{ target: "nutzungsartBebaut" }],
      },
    },
    keineNutzung: {
      type: "final",
      on: {
        BACK: [
          {
            target: "bundesland",
            cond: negate(pruefenConditions.isBundesmodelBundesland),
          },
          {
            target: "nutzungsartUnbebaut",
            cond: pruefenConditions.isWirtschaftlichUnbebaut,
          },
          {
            target: "gebaeudeArtBewohnbar",
            cond: pruefenConditions.isUnsupportedBewohnbar,
          },
          {
            target: "gebaeudeArtUnbewohnbar",
            cond: pruefenConditions.isUnsupportedUnbewohnbar,
          },
          {
            target: "gebaeudeArtUnbebaut",
            cond: pruefenConditions.isUnsupportedUnbebaut,
          },
          {
            target: "fremderBoden",
            cond: negate(pruefenConditions.isNotFremderBoden),
          },
          {
            target: "beguenstigung",
            cond: negate(pruefenConditions.isNotBeguenstigung),
          },
          {
            target: "abgeber",
            cond: negate(pruefenConditions.isEigentuemer),
          },
          {
            target: "eigentuemerTyp",
            cond: negate(pruefenConditions.isPrivatperson),
          },
          {
            target: "ausland",
            cond: negate(pruefenConditions.isNotAusland),
          },
        ],
      },
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
          { target: "eigentuemerTyp", cond: pruefenConditions.isEigentuemer },
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
          { target: "bundesland", cond: pruefenConditions.isPrivatperson },
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
          {
            target: "grundstueckArt",
            cond: pruefenConditions.isBundesmodelBundesland,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    grundstueckArt: {
      on: {
        BACK: { target: "bundesland" },
        NEXT: [
          {
            target: "ausland",
            cond: pruefenConditions.isEligibleGrundstueckArt,
          },
          { target: "keineNutzung" },
        ],
      },
    },
    ausland: {
      on: {
        BACK: [{ target: "grundstueckArt" }],
        NEXT: [
          { target: "fremderBoden", cond: pruefenConditions.isNotAusland },
          { target: "keineNutzung" },
        ],
      },
    },
    fremderBoden: {
      on: {
        BACK: { target: "ausland" },
        NEXT: [
          {
            target: "beguenstigung",
            cond: pruefenConditions.isNotFremderBoden,
          },
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
            cond: pruefenConditions.isNotBeguenstigung,
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
      on: {
        BACK: [
          {
            target: "start",
            cond: negate(pruefenConditions.isEigentuemer),
          },
          {
            target: "eigentuemerTyp",
            cond: negate(pruefenConditions.isPrivatperson),
          },
          {
            target: "bundesland",
            cond: negate(pruefenConditions.isBundesmodelBundesland),
          },
          {
            target: "grundstueckArt",
            cond: negate(pruefenConditions.isEligibleGrundstueckArt),
          },
          {
            target: "ausland",
            cond: negate(pruefenConditions.isNotAusland),
          },
          {
            target: "fremderBoden",
            cond: negate(pruefenConditions.isNotFremderBoden),
          },
          {
            target: "beguenstigung",
          },
        ],
      },
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
