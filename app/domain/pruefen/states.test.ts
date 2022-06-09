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
        expectedPath: ["eigentuemerTyp", "keineNutzung"],
      },
      {
        description: "with invalid erbengemeinschaft",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({
            isErbengemeinschaft: "erbengemeinschaftNotInGrundbuch",
          })
          .build(),
        expectedPath: ["eigentuemerTyp", "erbengemeinschaft", "keineNutzung"],
      },
      {
        description: "with invalid bundesland",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "HE" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "keineNutzung",
        ],
      },
      {
        description: "with invalid grundstueckArt",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "landUndForst" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "keineNutzung",
        ],
      },
      {
        description: "with invalid garage",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .garagen({ garagen: "garageAufAnderemGrundstueck" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "garagen",
          "spaeterNutzung",
        ],
      },
      {
        description: "with living abroad",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .garagen({ garagen: "keine" })
          .ausland({ ausland: "true" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "garagen",
          "ausland",
          "keineNutzung",
        ],
      },
      {
        description: "with fremderBoden",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .garagen({ garagen: "keine" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "true" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "garagen",
          "ausland",
          "fremderBoden",
          "keineNutzung",
        ],
      },
      {
        description: "with beguenstigung",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .garagen({ garagen: "keine" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "true" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "garagen",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "keineNutzung",
        ],
      },
      {
        description: "with elster account",
        context: pruefenModelFactory
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
          .bundesland({ bundesland: "BE" })
          .grundstueckArt({ grundstueckArt: "unbebaut" })
          .garagen({ garagen: "keine" })
          .ausland({ ausland: "false" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .elster({ elster: "true" })
          .build(),
        expectedPath: [
          "eigentuemerTyp",
          "erbengemeinschaft",
          "bundesland",
          "grundstueckArt",
          "garagen",
          "ausland",
          "fremderBoden",
          "beguenstigung",
          "elster",
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
      "eigentuemerTyp",
      "erbengemeinschaft",
      "bundesland",
      "grundstueckArt",
      "garagen",
      "ausland",
      "fremderBoden",
      "beguenstigung",
      "elster",
      "nutzung",
    ];

    test("next next next with full data", () => {
      const path = getPath(statesForForwardTraversal, context);
      expect(path).toEqual(expectedPath);
    });

    test("back back back with full data", () => {
      const path = getPath(statesForReverseTraversal, context);
      expect(path).toEqual(expectedPath.reverse());
    });
  });
});
