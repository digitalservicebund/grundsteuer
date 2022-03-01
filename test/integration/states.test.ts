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
  refStates: StateMachineConfig,
  transitionName: "NEXT" | "BACK"
): StateMachineConfig => {
  return Object.entries({ ...refStates }).reduce((acc, [k, v]) => {
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

const getPath = (
  refStates: StateMachineConfig,
  context: StateMachineContext
) => {
  const machine = createMachine(
    { ...refStates, context },
    { guards: conditions, actions }
  );

  return Object.values(getSimplePaths(machine)).map(({ state }) => {
    let path = state.toStrings().at(-1);
    if (state.matches("eigentuemer.person")) {
      const personId = state.context?.personId || 1;
      path = path?.replace(/\.person\./, `.person.${personId}.`);
    } else if (state.matches("grundstueck.flurstueck")) {
      const flurstueckId = state.context?.flurstueckId || 1;
      path = path?.replace(/\.flurstueck\./, `.flurstueck.${flurstueckId}.`);
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

    const defaultGrundstueck = [
      "grundstueck.adresse",
      "grundstueck.steuernummer",
      "grundstueck.typ",
      "grundstueck.gemeinde",
      "grundstueck.anzahl",
      "grundstueck.flurstueck.1.angaben",
      "grundstueck.bodenrichtwert",
    ];

    const cases = [
      {
        description: "without context",
        context: grundModelFactory
          .grundstueckTyp({ typ: "abweichendeEntwicklung" })
          .build(),
        expectedPath: [
          "grundstueck.adresse",
          "grundstueck.steuernummer",
          "grundstueck.typ",
          "grundstueck.unbebaut",
          "grundstueck.gemeinde",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.bodenrichtwert",
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
        context: grundModelFactory
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .kernsaniert()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withWeitereWohnraeume()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withGaragen()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          ...defaultGrundstueck,
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
        context: grundModelFactory
          .grundstueckTyp({ typ: "abweichendeEntwicklung" })
          .eigentuemerAnzahl({ anzahl: "2" })
          .build(),
        expectedPath: [
          "grundstueck.adresse",
          "grundstueck.steuernummer",
          "grundstueck.typ",
          "grundstueck.unbebaut",
          "grundstueck.gemeinde",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.bodenrichtwert",
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
          .grundstueckTyp({ typ: "abweichendeEntwicklung" })
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
          "grundstueck.adresse",
          "grundstueck.steuernummer",
          "grundstueck.typ",
          "grundstueck.unbebaut",
          "grundstueck.gemeinde",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.bodenrichtwert",
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
