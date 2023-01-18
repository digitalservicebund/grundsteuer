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
  const statesForForwardTraversal = removeTransitionsPruefen(
    pruefenStates,
    "BACK"
  );

  function traverseForward(
    cases: {
      context: PruefenMachineContext;
      description: string;
      expectedPath: string[];
    }[]
  ) {
    test.each(cases)(
      "next, next, next $description",
      ({ context, expectedPath }) => {
        const path = getPath(statesForForwardTraversal, context);
        expect(path).toEqual(expectedPath);
      }
    );
  }

  function traverseBackward(
    cases: {
      context: PruefenMachineContext;
      description: string;
      expectedPath: string[];
    }[],
    statesForReverseTraversal: any
  ) {
    test.each(cases)(
      "back, back, back $description",
      ({ context, expectedPath }) => {
        const path = getPath(statesForReverseTraversal, context);
        expectedPath.reverse();
        expect(path).toEqual(expectedPath);
      }
    );
  }

  describe("Keine Nutzung", () => {
    const statesForReverseTraversal = removeTransitionsPruefen(
      { ...pruefenStates, initial: "keineNutzung" },
      "NEXT"
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
      {
        description: `hof with supported nutzungsart but living abroad`,
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "hof" })
          .nutzungsartBebaut({ privat: "true" })
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
          "nutzungsartBebaut",
          "fremderBoden",
          "beguenstigung",
          "abgeber",
          "eigentuemerTyp",
          "ausland",
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
      ...["moor", "other"].map((art) => {
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
      ...["acker", "garten"].map((art) => {
        return {
          description: `unbebaut ${art} with unsupported nutzungsart`,
          context: pruefenModelFactory
            .bundesland({ bundesland: "BE" })
            .bewohnbar({ bewohnbar: "unbebaut" })
            .gebaeudeArtUnbebaut({ art: art as UnbebautType })
            .nutzungsartUnbebaut({ privat: "false" })
            .build(),
          expectedPath: [
            "bundesland",
            "bewohnbar",
            "gebaeudeArtUnbebaut",
            "nutzungsartUnbebaut",
            "keineNutzung",
          ],
        };
      }),
      ...["acker", "garten"].map((art) => {
        return {
          description: `unbebaut ${art} with supported nutzungsart but living abroad`,
          context: pruefenModelFactory
            .bundesland({ bundesland: "BE" })
            .bewohnbar({ bewohnbar: "unbebaut" })
            .gebaeudeArtUnbebaut({ art: art as UnbebautType })
            .nutzungsartUnbebaut({ privat: "true" })
            .fremderBoden({ fremderBoden: "false" })
            .beguenstigung({ beguenstigung: "false" })
            .abgeber({ abgeber: "eigentuemer" })
            .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
            .ausland({ ausland: "true" })
            .build(),
          expectedPath: [
            "bundesland",
            "bewohnbar",
            "gebaeudeArtUnbebaut",
            "nutzungsartUnbebaut",
            "fremderBoden",
            "beguenstigung",
            "abgeber",
            "eigentuemerTyp",
            "ausland",
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

    traverseForward(cases);
    traverseBackward(cases, statesForReverseTraversal);
  });

  describe("Nutzung", () => {
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

    traverseForward(cases);
    traverseBackward(cases, statesForReverseTraversal);
  });

  describe("Mehrere Erklaerungen", () => {
    const statesForReverseTraversal = removeTransitionsPruefen(
      { ...pruefenStates, initial: "mehrereErklaerungen" },
      "NEXT"
    );

    const cases = [
      {
        description: "hof with unsupported nutzungsart",
        context: pruefenModelFactory
          .bundesland({ bundesland: "BE" })
          .bewohnbar({ bewohnbar: "bewohnbar" })
          .gebaeudeArtBewohnbar({ gebaeude: "hof" })
          .nutzungsartBebaut({ privat: "false" })
          .build(),
        expectedPath: [
          "bundesland",
          "bewohnbar",
          "gebaeudeArtBewohnbar",
          "nutzungsartBebaut",
          "mehrereErklaerungen",
        ],
      },
    ];
    traverseForward(cases);
    traverseBackward(cases, statesForReverseTraversal);
  });
});
