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
import { getPathsFromState } from "~/util/getPathsFromState";

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

  return Object.values(getSimplePaths(machine)).map(
    ({ state }) => getPathsFromState({ state }).pathWithId
  );
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
      "eigentuemer.person.1.steuerId",
      "eigentuemer.person.1.gesetzlicherVertreter",
      "eigentuemer.empfangsvollmacht",
    ];

    const defaultGrundstueck = [
      "grundstueck.adresse",
      "grundstueck.steuernummer",
      "grundstueck.typ",
      "grundstueck.gemeinde",
      "grundstueck.anzahl",
      "grundstueck.flurstueck.1.angaben",
      "grundstueck.flurstueck.1.flur",
      "grundstueck.flurstueck.1.groesse",
      "grundstueck.bodenrichtwert",
    ];

    const defaultGebaeude = [
      "gebaeude.ab1949",
      "gebaeude.kernsaniert",
      "gebaeude.abbruchverpflichtung",
      "gebaeude.wohnflaeche",
      "gebaeude.weitereWohnraeume",
      "gebaeude.garagen",
    ];

    const cases = [
      {
        description: "without context",
        context: grundModelFactory.build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.empfangsvollmacht",
          "zusammenfassung",
        ],
      },
      {
        description: "abweichende Entwicklung",
        context: grundModelFactory
          .grundstueckTyp({ typ: "abweichendeEntwicklung" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.adresse",
          "grundstueck.steuernummer",
          "grundstueck.typ",
          "grundstueck.abweichendeEntwicklung",
          "grundstueck.gemeinde",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.bodenrichtwert",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus vor 1949 no frills",
        context: grundModelFactory
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          ...defaultGebaeude,
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.abbruchverpflichtung",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
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
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Einfamilienhaus ab 1949 kernsaniert with weitere wohnraeume, abbruchverpflichtung and garagen",
        context: grundModelFactory
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .hasAbbruchverpflichtung()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.abbruchverpflichtungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Wohnungseigentum ab 1949 kernsaniert with weitere wohnraeume, abbruchverpflichtung and garagen",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .gebaeudeAb1949()
          .kernsaniert()
          .hasAbbruchverpflichtung()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.abbruchverpflichtungsjahr",
          "gebaeude.wohnflaeche",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Zweifamilienhaus ab 1949 kernsaniert with weitere wohnraeume and garagen",
        context: grundModelFactory
          .grundstueckTyp({ typ: "zweifamilienhaus" })
          .gebaeudeAb1949()
          .kernsaniert()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          "gebaeude.ab1949",
          "gebaeude.baujahr",
          "gebaeude.kernsaniert",
          "gebaeude.kernsanierungsjahr",
          "gebaeude.abbruchverpflichtung",
          "gebaeude.wohnflaechen",
          "gebaeude.weitereWohnraeume",
          "gebaeude.weitereWohnraeumeDetails",
          "gebaeude.garagen",
          "gebaeude.garagenAnzahl",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "with 2 eigentuemer people",
        context: grundModelFactory.eigentuemerAnzahl({ anzahl: "2" }).build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          "eigentuemer.anzahl",
          "eigentuemer.verheiratet",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.person.1.anteil",
          "eigentuemer.person.2.persoenlicheAngaben",
          "eigentuemer.person.2.adresse",
          "eigentuemer.person.2.steuerId",
          "eigentuemer.person.2.gesetzlicherVertreter",
          "eigentuemer.person.2.anteil",
          "eigentuemer.empfangsvollmacht",
          "zusammenfassung",
        ],
      },
      {
        description: "with 3 eigentuemer people (2 with vertreter)",
        context: grundModelFactory
          .grundstueckTyp()
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
          "welcome",
          ...defaultGrundstueck,
          ...defaultGebaeude,
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.person.1.vertreter.name",
          "eigentuemer.person.1.vertreter.adresse",
          "eigentuemer.person.1.anteil",
          "eigentuemer.person.2.persoenlicheAngaben",
          "eigentuemer.person.2.adresse",
          "eigentuemer.person.2.steuerId",
          "eigentuemer.person.2.gesetzlicherVertreter",
          "eigentuemer.person.2.anteil",
          "eigentuemer.person.3.persoenlicheAngaben",
          "eigentuemer.person.3.adresse",
          "eigentuemer.person.3.steuerId",
          "eigentuemer.person.3.gesetzlicherVertreter",
          "eigentuemer.person.3.vertreter.name",
          "eigentuemer.person.3.vertreter.adresse",
          "eigentuemer.person.3.anteil",
          "eigentuemer.bruchteilsgemeinschaft",
          "eigentuemer.empfangsvollmacht",
          "zusammenfassung",
        ],
      },
      {
        description: "with bruchteilsgemeinschaft angaben",
        context: grundModelFactory
          .grundstueckTyp()
          .eigentuemerAnzahl({ anzahl: "3" })
          .eigentuemerBruchteilsgemeinschaft({ predefinedData: "false" })
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          ...defaultGebaeude,
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.person.1.anteil",
          "eigentuemer.person.2.persoenlicheAngaben",
          "eigentuemer.person.2.adresse",
          "eigentuemer.person.2.steuerId",
          "eigentuemer.person.2.gesetzlicherVertreter",
          "eigentuemer.person.2.anteil",
          "eigentuemer.person.3.persoenlicheAngaben",
          "eigentuemer.person.3.adresse",
          "eigentuemer.person.3.steuerId",
          "eigentuemer.person.3.gesetzlicherVertreter",
          "eigentuemer.person.3.anteil",
          "eigentuemer.bruchteilsgemeinschaft",
          "eigentuemer.bruchteilsgemeinschaftangaben.angaben",
          "eigentuemer.empfangsvollmacht",
          "zusammenfassung",
        ],
      },
      {
        description: "with empfangsbevollmaechtigter",
        context: grundModelFactory
          .grundstueckTyp()
          .eigentuemerEmpfangsvollmacht({ hasEmpfangsvollmacht: "true" })
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueck,
          ...defaultGebaeude,
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.empfangsvollmacht",
          "eigentuemer.empfangsbevollmaechtigter.name",
          "eigentuemer.empfangsbevollmaechtigter.adresse",
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
