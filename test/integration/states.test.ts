import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import {
  states,
  StateMachineConfig,
  StateMachineContext,
} from "~/domain/states";
import { conditions } from "~/domain/guards";
import { actions } from "~/domain/actions";
import { grundModelFactory } from "test/factories";

const removeTransitions = (
  states: StateMachineConfig,
  transitionName: "NEXT" | "BACK"
): StateMachineConfig => {
  return Object.entries({ ...states }).reduce((acc, [k, v]) => {
    if (k === transitionName) {
      return { ...acc, [k]: undefined };
    } else if (Array.isArray(v)) {
      return {
        ...acc,
        [k]: v.map((c) =>
          typeof c === "object" ? removeTransitions(c, transitionName) : c
        ),
      };
    } else if (v !== null && typeof v === "object") {
      return {
        ...acc,
        [k]: removeTransitions(v, transitionName),
      };
    } else {
      return { ...acc, [k]: v };
    }
  }, {});
};

const getPath = (states: StateMachineConfig, context: StateMachineContext) => {
  const machine = createMachine(
    { ...states, context },
    { guards: conditions, actions }
  );

  return Object.values(getSimplePaths(machine)).map(({ state }) => {
    let path = state.toStrings().at(-1);
    if (state.matches("eigentuemer.person")) {
      const currentId = state.context?.currentId || 1;
      path = path?.replace(/\.person\./, `.person.${currentId}.`);
    }
    return path;
  });
};

describe("states", () => {
  describe("traversal", () => {
    const statesForForwardTraversal = removeTransitions(states, "BACK");
    const statesForReverseTraversal = removeTransitions(
      { ...states, initial: "zusammenfassung" },
      "NEXT"
    );

    const defaultEigentuemer = [
      "eigentuemer.anzahl",
      "eigentuemer.person.1.persoenlicheAngaben",
      "eigentuemer.person.1.adresse",
      "eigentuemer.person.1.telefonnummer",
      "eigentuemer.person.1.steuerId",
      "eigentuemer.person.1.gesetzlicherVertreter",
    ];
    const cases = [
      {
        description: "without context",
        context: grundModelFactory.build(),
        expectedPath: [
          "grundstueck",
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.telefonnummer",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus vor 1949 no frills",
        context: grundModelFactory.grundstueck({ bebaut: "true" }).build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.kernsaniert",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.garagen",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus ab 1949 no frills",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.garagen",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus ab 1949 kernsaniert",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .kernsaniert()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.garagen",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus vor 1949 kernsaniert",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .kernsaniert()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.garagen",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Einfamilienhaus ab 1949 with weitere wohnraeume and garagen",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeFlaeche",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Einfamilienhaus ab 1949 kernsaniert with weitere wohnraeume",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withWeitereWohnraeume()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeFlaeche",
          "gebaeude.garagen",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus ab 1949 kernsaniert with garagen",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withGaragen()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Einfamilienhaus ab 1949 kernsaniert with weitere wohnraeume and garagen",
        context: grundModelFactory
          .grundstueck({ bebaut: "true" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "grundstueck",
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeFlaeche",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      // TODO add cases for zweifamilienhaus
      {
        description: "with 2 eigentuemer people",
        context: grundModelFactory.eigentuemerAnzahl({ anzahl: "2" }).build(),
        expectedPath: [
          "grundstueck",
          "eigentuemer.anzahl",
          "eigentuemer.verheiratet",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.telefonnummer",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.person.1.anteil",
          "eigentuemer.person.2.persoenlicheAngaben",
          "eigentuemer.person.2.adresse",
          "eigentuemer.person.2.telefonnummer",
          "eigentuemer.person.2.steuerId",
          "eigentuemer.person.2.gesetzlicherVertreter",
          "eigentuemer.person.2.anteil",
          "zusammenfassung",
        ],
      },
      {
        description: "with 3 eigentuemer people (2 with vertreter)",
        context: grundModelFactory
          .eigentuemerAnzahl({ anzahl: "3" })
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "true" },
            { transient: { personIndex: 0 } }
          )
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "false" },
            { transient: { personIndex: 1 } }
          )
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "true" },
            { transient: { personIndex: 2 } }
          )
          .build(),
        expectedPath: [
          "grundstueck",
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.telefonnummer",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.person.1.vertreter.name",
          "eigentuemer.person.1.vertreter.adresse",
          "eigentuemer.person.1.vertreter.telefonnummer",
          "eigentuemer.person.1.anteil",
          "eigentuemer.person.2.persoenlicheAngaben",
          "eigentuemer.person.2.adresse",
          "eigentuemer.person.2.telefonnummer",
          "eigentuemer.person.2.steuerId",
          "eigentuemer.person.2.gesetzlicherVertreter",
          "eigentuemer.person.2.anteil",
          "eigentuemer.person.3.persoenlicheAngaben",
          "eigentuemer.person.3.adresse",
          "eigentuemer.person.3.telefonnummer",
          "eigentuemer.person.3.steuerId",
          "eigentuemer.person.3.gesetzlicherVertreter",
          "eigentuemer.person.3.vertreter.name",
          "eigentuemer.person.3.vertreter.adresse",
          "eigentuemer.person.3.vertreter.telefonnummer",
          "eigentuemer.person.3.anteil",
          "zusammenfassung",
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
        expect(path).toEqual(expectedPath.reverse());
      }
    );
  });
});
