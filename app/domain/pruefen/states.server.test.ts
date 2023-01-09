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
import {
  BewohnbarType,
  UnbebautType,
  UnbewohnbarType,
} from "~/domain/pruefen/model";

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
        expectedPath: ["bundesland", "keineNutzung"],
      },
      {
        description: "with unsupported bundesland",
        context: pruefenModelFactory.bundesland({ bundesland: "BY" }).build(),
        expectedPath: ["bundesland", "keineNutzung"],
      },
      {
        description: "with unsupported nutzungsart",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "hof" })
          .nutzungsart({ wirtschaftlich: "true" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "nutzungsart",
          "mehrereErklaerungen",
        ],
      },
      {
        description: "with unsupported gebaeudeArt mehrfamilienhaus",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "mehrfamilienhaus" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "keineNutzung",
        ],
      },

      ...["garage", "wochenendhaus", "geschaeft", "luf", "other"].map((art) => {
        return {
          description: `with unsupported unbewohnbar gebaeudeArt ${art}`,
          context: pruefenModelFactory
            .bundesland({ bundesland: "BE" })
            .bewohnbar({ bewohnbar: "unbewohnbar" })
            .gebaeudeArtUnbewohnbar({
              gebaeude: art as UnbewohnbarType,
            })
            .build(),
          expectedPath: [
            "bundesland",
            "bewohnbar",
            "gebaeudeArtUnbewohnbar",
            "keineNutzung",
          ],
        };
      }),
      ...["acker", "wald", "garten", "moor", "other"].map((art) => {
        return {
          description: `with unsupported unbebaut gebaeudeArt ${art}`,
          context: pruefenModelFactory
            .bundesland({ bundesland: "BE" })
            .bewohnbar({ bewohnbar: "unbebaut" })
            .gebaeudeArtUnbebaut({
              art: art as UnbebautType,
            })
            .build(),
          expectedPath: [
            "bundesland",
            "bewohnbar",
            "gebaeudeArtUnbebaut",
            "keineNutzung",
          ],
        };
      }),
      {
        description: "with living abroad",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .ausland({ ausland: "true" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "fremderBoden",
          "beguenstigung",
          "abgeber",
          "eigentuemerTyp",
          "ausland",
          "keineNutzung",
        ],
      },
      {
        description: "with fremderBoden",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .fremderBoden({ fremderBoden: "true" })
          .beguenstigung({ beguenstigung: "false" })
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .ausland({ ausland: "true" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "fremderBoden",
          "keineNutzung",
        ],
      },
      {
        description: "with beguenstigung",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "true" })
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .ausland({ ausland: "true" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "fremderBoden",
          "beguenstigung",
          "keineNutzung",
        ],
      },

      {
        description: `with unsupported abgeber steuerberater`,
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .abgeber({ abgeber: "steuerberater" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .ausland({ ausland: "false" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "fremderBoden",
          "beguenstigung",
          "abgeber",
          "keineNutzung",
        ],
      },
      {
        description: `with unsupported eigentuemerTyp unternehmen`,
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "einfamilienhaus" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "unternehmen" })
          .ausland({ ausland: "false" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "fremderBoden",
          "beguenstigung",
          "abgeber",
          "eigentuemerTyp",
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
      ...["einfamilienhaus", "zweifamilienhaus", "eigentumswohnung"].map(
        (art) => {
          return {
            description: `with supported bewohnbar gebaeudeArt ${art}`,
            context: pruefenModelFactory
              .bundesland({ bundesland: "BE" })
              .bewohnbar({ bewohnbar: "bewohnbar" })
              .gebaeudeArtBewohnbar({
                gebaeude: art as BewohnbarType,
              })
              .fremderBoden({ fremderBoden: "false" })
              .beguenstigung({ beguenstigung: "false" })
              .abgeber({ abgeber: "eigentuemer" })
              .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
              .ausland({ ausland: "false" })
              .build(),
            expectedPath: [
              "bundesland",
              "bewohnbar",
              "gebaeudeArtBewohnbar",
              "fremderBoden",
              "beguenstigung",
              "abgeber",
              "eigentuemerTyp",
              "ausland",
              "nutzung",
            ],
          };
        }
      ),

      ...["imBau", "verfallen"].map((art) => {
        return {
          description: `with supported unbewohnbar gebaeudeArt ${art}`,
          context: pruefenModelFactory
            .bundesland({ bundesland: "BE" })
            .bewohnbar({ bewohnbar: "unbewohnbar" })
            .gebaeudeArtUnbewohnbar({
              gebaeude: art as UnbewohnbarType,
            })
            .fremderBoden({ fremderBoden: "false" })
            .beguenstigung({ beguenstigung: "false" })
            .abgeber({ abgeber: "eigentuemer" })
            .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
            .ausland({ ausland: "false" })
            .build(),
          expectedPath: [
            "bundesland",
            "bewohnbar",
            "gebaeudeArtUnbewohnbar",
            "fremderBoden",
            "beguenstigung",
            "abgeber",
            "eigentuemerTyp",
            "ausland",
            "nutzung",
          ],
        };
      }),

      {
        description: "with supported unbebaut art baureif",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "unbebaut" })
          .gebaeudeArtUnbebaut({ art: "baureif" })
          .fremderBoden({ fremderBoden: "false" })
          .beguenstigung({ beguenstigung: "false" })
          .abgeber({ abgeber: "eigentuemer" })
          .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
          .ausland({ ausland: "false" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtUnbebaut",
          "fremderBoden",
          "beguenstigung",
          "abgeber",
          "eigentuemerTyp",
          "ausland",
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
