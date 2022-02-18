import { GrundModel } from "./model";
import { personAdresseFields } from "~/domain/fields/eigentuemer/person/adresse";
import { gesVertreterField } from "~/domain/fields/eigentuemer/person/gesetzlicherVertreter";

export interface StateMachineContext extends GrundModel {
  currentId?: number;
}

export const states = {
  id: "steps",
  initial: "eigentuemer",
  states: {
    eigentuemer: {
      id: "eigentuemer",
      initial: "anzahl",
      states: {
        anzahl: {
          on: {
            NEXT: [
              {
                target: "verheiratet",
                cond: "anzahlEigentuemerIsTwo",
              },
              {
                target: "person",
              },
            ],
          },
        },
        verheiratet: {
          on: {
            NEXT: {
              target: "person",
            },
          },
        },
        person: {
          id: "person",
          initial: "persoenlicheAngaben",
          states: {
            persoenlicheAngaben: {
              on: { NEXT: "adresse" },
            },
            adresse: {
              meta: {
                stepDefinition: {
                  fields: personAdresseFields,
                },
              },
              on: {
                NEXT: [
                  {
                    target: "telefonnummer",
                  },
                ],
              },
            },
            telefonnummer: { on: { NEXT: "steuerId" } },
            steuerId: { on: { NEXT: "gesetzlicherVertreter" } },
            gesetzlicherVertreter: {
              meta: {
                stepDefinition: {
                  fields: [gesVertreterField],
                },
              },
              on: {
                NEXT: [
                  {
                    target: "#person",
                    cond: "hasNotGesetzlicherVertreterAndRepeatPerson",
                    actions: ["incrementCurrentId"],
                  },
                  {
                    target: "vertreter",
                    cond: "hasGesetzlicherVertreter",
                  },
                  { target: "anteil", cond: "multipleEigentuemer" },

                  {
                    target: "#steps.grundstueck",
                  },
                ],
              },
            },
            vertreter: {
              id: "vertreter",
              initial: "gesetzlicherVertreterDaten",
              states: {
                gesetzlicherVertreterDaten: {
                  on: {
                    NEXT: [{ target: "name" }],
                  },
                },
                name: {
                  on: {
                    NEXT: [
                      {
                        target: "adresse",
                      },
                    ],
                  },
                },
                adresse: {
                  on: {
                    NEXT: [
                      {
                        target: "telefonnummer",
                      },
                    ],
                  },
                },
                telefonnummer: {
                  on: {
                    NEXT: [
                      { target: "#person.anteil", cond: "multipleEigentuemer" },
                      {
                        target: "#steps.grundstueck",
                      },
                    ],
                  },
                },
              },
            },
            anteil: {
              on: {
                NEXT: [
                  {
                    target: "#person",
                    cond: "repeatPerson",
                    actions: ["incrementCurrentId"],
                  },
                  {
                    target: "#steps.grundstueck",
                  },
                ],
              },
            },
          },
        },
      },
    },
    grundstueck: { on: { NEXT: "zusammenfassung" } },
    zusammenfassung: { type: "final" },
  },
};

export const getMachineConfig = (records: StateMachineContext) => {
  return Object.assign({}, states, { context: records });
};
