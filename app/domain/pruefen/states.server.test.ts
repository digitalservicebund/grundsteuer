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
} from "~/domain/pruefen/states.server";
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
        description: "with special LuF gebaeudeArtBewohnbar",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "hof" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "lufSpezial",
        ],
      },
      {
        description: "with invalid gebaeudeArtBewohnbar",
        context: pruefenModelFactory
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "mehrfamilienhaus" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
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
          "bewohnbar",
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
          "bewohnbar",
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
          "bewohnbar",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "keineNutzung",
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

    const cases = [
      {
        description: "bewohnbar",
        context: pruefenModelFactory
          .full()
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "nutzung",
        ],
      },
      {
        description: "not bewohnbar",
        context: pruefenModelFactory.full().build(),
        expectedPath: [
          "start",
          "eigentuemerTyp",
          "bundesland",
          "bewohnbar",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "nutzung",
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

    test.each(cases)(
      "back, back, back $description",
      ({ context, expectedPath }) => {
        const path = getPath(statesForReverseTraversal, context);
        expectedPath.reverse();
        expect(path).toEqual(expectedPath);
      }
    );
  });
});
