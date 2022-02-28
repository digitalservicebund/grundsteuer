import { MachineConfig } from "xstate";
import { GrundModel } from "./steps";

export interface StateMachineContext extends GrundModel {
  currentId?: number;
}

export const states: MachineConfig<any, any, any> = {
  id: "steps",
  initial: "grundstueck",
  states: {
    grundstueck: {
      id: "grundstueck",
      on: {
        NEXT: [
          { target: "gebaeude", cond: "showGebaeude" },
          { target: "eigentuemer" },
        ],
      },
    },
    gebaeude: {
      id: "gebaeude",
      initial: "ab1949",
      states: {
        ab1949: {
          on: {
            NEXT: [
              { target: "baujahr", cond: "bezugsfertigAb1949" },
              { target: "kernsaniert" },
            ],
            BACK: {
              target: "#grundstueck",
            },
          },
        },
        baujahr: {
          on: {
            NEXT: {
              target: "kernsaniert",
            },
            BACK: {
              target: "ab1949",
            },
          },
        },
        kernsaniert: {
          on: {
            NEXT: [{ target: "kernsanierungsjahr", cond: "isKernsaniert" }],
            BACK: [
              { target: "baujahr", cond: "bezugsfertigAb1949" },
              { target: "ab1949" },
            ],
          },
        },
        kernsanierungsjahr: {
          on: {
            BACK: [{ target: "kernsaniert" }],
          },
        },
      },
      on: { NEXT: "eigentuemer", BACK: "grundstueck" },
    },
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
            BACK: [
              { target: "#steps.gebaeude", cond: "showGebaeude" },
              { target: "#steps.grundstueck" },
            ],
          },
        },
        verheiratet: {
          on: {
            NEXT: {
              target: "person",
            },
            BACK: {
              target: "anzahl",
            },
          },
        },
        person: {
          id: "person",
          initial: "persoenlicheAngaben",
          states: {
            persoenlicheAngaben: {
              on: {
                NEXT: {
                  target: "adresse",
                },
                BACK: [
                  {
                    target: "anteil",
                    cond: "currentIdGreaterThanOne",

                    actions: ["decrementCurrentId"],
                  },
                ],
              },
            },
            adresse: {
              on: {
                NEXT: {
                  target: "telefonnummer",
                },
                BACK: { target: "persoenlicheAngaben" },
              },
            },
            telefonnummer: { on: { NEXT: "steuerId", BACK: "adresse" } },
            steuerId: {
              on: { NEXT: "gesetzlicherVertreter", BACK: "telefonnummer" },
            },
            gesetzlicherVertreter: {
              on: {
                NEXT: [
                  {
                    target: "vertreter",
                    cond: "hasGesetzlicherVertreter",
                  },
                  { target: "anteil", cond: "multipleEigentuemer" },
                ],
                BACK: { target: "steuerId" },
              },
            },
            vertreter: {
              id: "vertreter",
              initial: "name",
              states: {
                name: {
                  on: {
                    NEXT: { target: "adresse" },
                  },
                },
                adresse: {
                  on: {
                    NEXT: { target: "telefonnummer" },
                    BACK: { target: "name" },
                  },
                },
                telefonnummer: {
                  on: {
                    BACK: { target: "adresse" },
                  },
                },
              },
              on: {
                NEXT: { target: "anteil", cond: "multipleEigentuemer" },
                BACK: { target: "gesetzlicherVertreter" },
              },
            },
            anteil: {
              on: {
                BACK: [
                  {
                    target: "vertreter.telefonnummer",
                    cond: "hasGesetzlicherVertreter",
                  },
                  { target: "gesetzlicherVertreter" },
                ],
              },
            },
          },
          on: {
            BACK: [
              { target: "verheiratet", cond: "anzahlEigentuemerIsTwo" },
              { target: "anzahl" },
            ],
            NEXT: {
              target: "person",
              cond: "repeatPerson",
              actions: ["incrementCurrentId"],
            },
          },
        },
      },
      on: {
        NEXT: { target: "zusammenfassung" },
      },
    },
    zusammenfassung: {
      type: "final",
      on: {
        BACK: [
          {
            target: "eigentuemer.person.anteil",
            cond: "multipleEigentuemer",
            actions: "setCurrentIdToMaximum",
          },
          {
            target: "eigentuemer.person.vertreter.telefonnummer",
            cond: "hasGesetzlicherVertreter",
            actions: "setCurrentIdToMaximum",
          },
          {
            target: "eigentuemer.person.gesetzlicherVertreter",
            actions: "setCurrentIdToMaximum",
          },
        ],
      },
    },
  },
};

export type StateMachineConfig = typeof states;

export const getMachineConfig = (records: StateMachineContext) => {
  return Object.assign({}, states, { context: records });
};
