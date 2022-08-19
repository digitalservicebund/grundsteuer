import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import { getPathsFromState } from "~/util/getPathsFromState";
import {
  RecursiveStringRecord,
  removeTransitions,
} from "test/utils/removeTransitions";
import {
  PruefenMachineConfig,
  PruefenMachineContext,
  pruefenStates,
} from "~/domain/pruefen/states";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { pruefenModelFactory } from "test/factories/pruefen";

const removeTransitionsPruefen = (
  refStates: PruefenMachineConfig,
  transitionName: "NEXT" | "BACK"
): PruefenMachineConfig => {
  return removeTransitions(refStates as RecursiveStringRecord, transitionName);
};

const getPath = (
  refStates: PruefenMachineConfig,
  context: PruefenMachineContext
) => {
  const machine = createMachine(
    { ...refStates, context },
    { guards: pruefenConditions }
  );

  return Object.values(getSimplePaths(machine)).map(
    ({ state }) => getPathsFromState({ state }).pathWithId
  );
};

describe("states", () => {
  describe("traversal", () => {
    const statesForForwardTraversal = removeTransitionsPruefen(
      pruefenStates,
      "BACK"
    );

    const cases = [
      {
        description: "without context",
        context: pruefenModelFactory.build(),
        expectedPath: ["start", "keineNutzung"],
      },
      {
        description: "with invalid abgeber",
        context: pruefenModelFactory
          .abgeber({ abgeber: "steuerberater" })
          .build(),
        expectedPath: ["start", "keineNutzung"],
      },
      {
        description: "with invalid eigentuemerTyp",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "unternehmen" })
          .build(),
        expectedPath: ["start", "eigentuemerTyp", "keineNutzung"],
      },
      {
        description: "with invalid bundesland",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "HE" })
          .build(),
        expectedPath: ["start", "eigentuemerTyp", "bundesland", "keineNutzung"],
      },
      {
        description: "with invalid grundstueckArt",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "landUndForst" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "keineNutzung",
        ],
      },
      {
        description: "with living abroad",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "true" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "keineNutzung",
        ],
      },
      {
        description: "with fremderBoden",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "true" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "fremderBoden",
          "keineNutzung",
        ],
      },
      {
        description: "with beguenstigung",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "true" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "keineNutzung",
        ],
      },
      {
        description: "with miteigentum garage",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .miteigentum({ miteigentum: "garage" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "miteigentum",
          "spaeterNutzung",
        ],
      },
      {
        description: "with miteigentum privatweg",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .miteigentum({ miteigentum: "privatweg" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "miteigentum",
          "spaeterNutzung",
        ],
      },
      {
        description: "with miteigentum anderer",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .miteigentum({ miteigentum: "anderer" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "grundstueckArt",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "miteigentum",
          "spaeterNutzung",
        ],
      },
    ];

    test.each(cases)(
      "next, next, next $description",
      ({ context, expectedPath }) => {
        const path = getPath(statesForForwardTraversal, context);
        expect(path).toEqual(expectedPath);
      }
    );
  });

  describe("full traversal", () => {
    const statesForForwardTraversal = removeTransitionsPruefen(
      pruefenStates,
      "BACK"
    );
    const statesForReverseTraversal = removeTransitionsPruefen(
      { ...pruefenStates, initial: "nutzung" },
      "NEXT"
    );
    const context = pruefenModelFactory.full().build();
    const expectedPath = [
      "start",
      "eigentuemerTyp",
      "bundesland",
      "grundstueckArt",
      "ausland",
      "fremderBoden",
      "beguenstigung",
      "miteigentum",
      "nutzung",
    ];

    test("next next next with full data", () => {
      const path = getPath(statesForForwardTraversal, context);
      expect(path).toEqual(expectedPath);
    });

    test("back back back with full data", () => {
      const path = getPath(statesForReverseTraversal, context);
      expectedPath.reverse();
      expect(path).toEqual(expectedPath);
    });
  });
});
