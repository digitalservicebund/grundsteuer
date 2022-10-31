import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import {
  states,
  StateMachineConfig,
  StateMachineContext,
} from "~/domain/states/states.server";
import { conditions } from "~/domain/states/guards";
import { actions } from "~/domain/states/actions.server";
import { flurstueckFactory, grundModelFactory } from "test/factories";
import { getPathsFromState } from "~/util/getPathsFromState";
import {
  RecursiveStringRecord,
  removeTransitions,
} from "test/utils/removeTransitions";

const removeTransitionsGrund = (
  refStates: StateMachineConfig,
  transitionName: "NEXT" | "BACK"
): StateMachineConfig => {
  return removeTransitions(refStates as RecursiveStringRecord, transitionName);
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
    const statesForForwardTraversal = removeTransitionsGrund(states, "BACK");
    const statesForReverseTraversal = removeTransitionsGrund(
      { ...states, initial: "zusammenfassung" },
      "NEXT"
    );

    const defaultEigentuemer = [
      "eigentuemer.uebersicht",
      "eigentuemer.anzahl",
      "eigentuemer.person.1.persoenlicheAngaben",
      "eigentuemer.person.1.adresse",
      "eigentuemer.person.1.steuerId",
      "eigentuemer.person.1.gesetzlicherVertreter",
      "eigentuemer.empfangsvollmacht",
      "eigentuemer.abschluss",
    ];

    const defaultGrundstueck = [
      "grundstueck.uebersicht",
      "grundstueck.typ",
      "grundstueck.adresse",
      "grundstueck.gemeinde",
      "grundstueck.bodenrichtwertInfo",
      "grundstueck.bodenrichtwertAnzahl",
      "grundstueck.bodenrichtwertEingabe",
      "grundstueck.anzahl",
      "grundstueck.flurstueck.1.angaben",
      "grundstueck.flurstueck.1.flur",
      "grundstueck.flurstueck.1.groesse",
    ];

    const defaultGrundstueckTypGiven = [
      "grundstueck.uebersicht",
      "grundstueck.typ",
      "grundstueck.adresse",
      "grundstueck.gemeinde",
      "grundstueck.bodenrichtwertInfo",
      "grundstueck.bodenrichtwertAnzahl",
      "grundstueck.bodenrichtwertEingabe",
      "grundstueck.miteigentumAuswahlHaus",
      "grundstueck.anzahl",
      "grundstueck.flurstueck.1.angaben",
      "grundstueck.flurstueck.1.flur",
      "grundstueck.flurstueck.1.groesse",
    ];

    const defaultGebaeude = [
      "gebaeude.uebersicht",
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
          "eigentuemer.uebersicht",
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.empfangsvollmacht",
          "eigentuemer.abschluss",
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
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.abweichendeEntwicklung",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlHaus",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "baureif with miteigentum",
        context: grundModelFactory
          .grundstueckTyp({ typ: "baureif" })
          .flurstueckAnzahl({ anzahl: "1" })
          .miteigentumHaus({ hasMiteigentum: "true" })
          .grundstueckFlurstueck({
            list: [
              flurstueckFactory
                .miteigentumAuswahl({ hasMiteigentum: "true" })
                .miteigentum()
                .build(),
            ],
            count: 1,
          })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlHaus",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.flurstueck.1.miteigentumAuswahl",
          "grundstueck.flurstueck.1.miteigentum",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Einfamilienhaus with partial Miteigentumsanteil",
        context: grundModelFactory
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .flurstueckAnzahl({ anzahl: "2" })
          .miteigentumHaus({ hasMiteigentum: "true" })
          .grundstueckFlurstueck({
            list: [
              flurstueckFactory
                .miteigentumAuswahl({ hasMiteigentum: "false" })
                .build(),
              flurstueckFactory
                .miteigentumAuswahl({ hasMiteigentum: "true" })
                .miteigentum()
                .build(),
            ],
            count: 2,
          })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlHaus",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.flurstueck.1.miteigentumAuswahl",
          "grundstueck.flurstueck.2.angaben",
          "grundstueck.flurstueck.2.flur",
          "grundstueck.flurstueck.2.groesse",
          "grundstueck.flurstueck.2.miteigentumAuswahl",
          "grundstueck.flurstueck.2.miteigentum",
          ...defaultGebaeude,
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
          ...defaultGrundstueckTypGiven,
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          .abbruchverpflichtung()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "welcome",
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          .abbruchverpflichtung()
          .withWeitereWohnraeume()
          .withGaragen()
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "gebaeude.uebersicht",
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
        description: "Wohnungseigentum with simple Miteigentumsanteil",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .miteigentumWohnung({ miteigentumTyp: "none" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.miteigentumWohnung",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          ...defaultGebaeude,
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "Wohnungseigentum with garage",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .miteigentumWohnung({ miteigentumTyp: "garage" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.miteigentumWohnung",
          "grundstueck.miteigentumGarage",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          ...defaultGebaeude,
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Wohnungseigentum with mixed miteigentum and no miteigentumsanteil",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .miteigentumWohnung({ miteigentumTyp: "mixed" })
          .flurstueckAnzahl({ anzahl: "2" })
          .miteigentumAuswahlFlurstueck(0, { hasMiteigentum: "false" })
          .miteigentumAuswahlFlurstueck(1, { hasMiteigentum: "false" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.flurstueck.1.miteigentumAuswahl",
          "grundstueck.flurstueck.2.angaben",
          "grundstueck.flurstueck.2.flur",
          "grundstueck.flurstueck.2.groesse",
          "grundstueck.flurstueck.2.miteigentumAuswahl",
          ...defaultGebaeude,
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Wohnungseigentum with mixed miteigentum and miteigentumsanteil",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .miteigentumWohnung({ miteigentumTyp: "mixed" })
          .flurstueckAnzahl({ anzahl: "2" })
          .miteigentumAuswahlFlurstueck(0, { hasMiteigentum: "true" })
          .miteigentumAuswahlFlurstueck(1, { hasMiteigentum: "true" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.flurstueck.1.miteigentumAuswahl",
          "grundstueck.flurstueck.1.miteigentum",
          "grundstueck.flurstueck.2.angaben",
          "grundstueck.flurstueck.2.flur",
          "grundstueck.flurstueck.2.groesse",
          "grundstueck.flurstueck.2.miteigentumAuswahl",
          "grundstueck.flurstueck.2.miteigentum",
          ...defaultGebaeude,
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description:
          "Wohnungseigentum with mixed miteigentum and mixed miteigentumsanteil",
        context: grundModelFactory
          .grundstueckTyp({ typ: "wohnungseigentum" })
          .miteigentumWohnung({ miteigentumTyp: "mixed" })
          .flurstueckAnzahl({ anzahl: "2" })
          .miteigentumAuswahlFlurstueck(0, { hasMiteigentum: "true" })
          .miteigentumAuswahlFlurstueck(1, { hasMiteigentum: "false" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.miteigentumAuswahlWohnung",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          "grundstueck.flurstueck.1.miteigentumAuswahl",
          "grundstueck.flurstueck.1.miteigentum",
          "grundstueck.flurstueck.2.angaben",
          "grundstueck.flurstueck.2.flur",
          "grundstueck.flurstueck.2.groesse",
          "grundstueck.flurstueck.2.miteigentumAuswahl",
          ...defaultGebaeude,
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "grundstueck without bundesland",
        context: grundModelFactory.grundstueckAdresse(undefined).build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
          ...defaultEigentuemer,
          "zusammenfassung",
        ],
      },
      {
        description: "grundstueck with bundesland",
        context: grundModelFactory
          .grundstueckAdresse({ bundesland: "BE" })
          .build(),
        expectedPath: [
          "welcome",
          "grundstueck.uebersicht",
          "grundstueck.typ",
          "grundstueck.adresse",
          "grundstueck.steuernummer",
          "grundstueck.gemeinde",
          "grundstueck.bodenrichtwertInfo",
          "grundstueck.bodenrichtwertAnzahl",
          "grundstueck.bodenrichtwertEingabe",
          "grundstueck.anzahl",
          "grundstueck.flurstueck.1.angaben",
          "grundstueck.flurstueck.1.flur",
          "grundstueck.flurstueck.1.groesse",
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
          ...defaultGrundstueckTypGiven,
          "gebaeude.uebersicht",
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
          "eigentuemer.uebersicht",
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
          "eigentuemer.abschluss",
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
          ...defaultGrundstueckTypGiven,
          ...defaultGebaeude,
          "eigentuemer.uebersicht",
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
          "eigentuemer.empfangsbevollmaechtigter.name",
          "eigentuemer.empfangsbevollmaechtigter.adresse",
          "eigentuemer.abschluss",
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
          ...defaultGrundstueckTypGiven,
          ...defaultGebaeude,
          "eigentuemer.uebersicht",
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
          "eigentuemer.empfangsbevollmaechtigter.name",
          "eigentuemer.empfangsbevollmaechtigter.adresse",
          "eigentuemer.abschluss",
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
          ...defaultGrundstueckTypGiven,
          ...defaultGebaeude,
          "eigentuemer.uebersicht",
          "eigentuemer.anzahl",
          "eigentuemer.person.1.persoenlicheAngaben",
          "eigentuemer.person.1.adresse",
          "eigentuemer.person.1.steuerId",
          "eigentuemer.person.1.gesetzlicherVertreter",
          "eigentuemer.empfangsvollmacht",
          "eigentuemer.empfangsbevollmaechtigter.name",
          "eigentuemer.empfangsbevollmaechtigter.adresse",
          "eigentuemer.abschluss",
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
