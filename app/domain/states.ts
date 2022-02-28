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
            NEXT: [
              { target: "kernsanierungsjahr", cond: "isKernsaniert" },
              { target: "wohnflaechen", cond: "zweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
            BACK: [
              { target: "baujahr", cond: "bezugsfertigAb1949" },
              { target: "ab1949" },
            ],
          },
        },
        kernsanierungsjahr: {
          on: {
            NEXT: [
              { target: "wohnflaechen", cond: "zweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
            BACK: [{ target: "kernsaniert" }],
          },
        },
        wohnflaeche: {
          on: {
            NEXT: {
              target: "weitereWohnraeume",
            },
            BACK: [
              { target: "kernsanierungsjahr", cond: "isKernsaniert" },
              { target: "kernsaniert" },
            ],
          },
        },
        wohnflaechen: {
          on: {
            NEXT: {
              target: "weitereWohnraeume",
            },
            BACK: [
              { target: "kernsanierungsjahr", cond: "isKernsaniert" },
              { target: "kernsaniert" },
            ],
          },
        },
        weitereWohnraeume: {
          on: {
            NEXT: [
              {
                target: "weitereWohnraeumeFlaeche",
                cond: "hasWeitereWohnraeume",
              },
              { target: "garagen" },
            ],
            BACK: [
              { target: "wohnflaechen", cond: "zweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
          },
        },
        weitereWohnraeumeFlaeche: {
          on: {
            NEXT: { target: "garagen" },
            BACK: [{ target: "weitereWohnraeume" }],
          },
        },
        garagen: {
          on: {
            NEXT: [
              { target: "garagenAnzahl", cond: "hasGaragen" },
              { target: "#eigentuemer" },
            ],
            BACK: [
              {
                target: "weitereWohnraeumeFlaeche",
                cond: "hasWeitereWohnraeume",
              },
              { target: "weitereWohnraeume" },
            ],
          },
        },
        garagenAnzahl: {
          on: {
            NEXT: { target: "#eigentuemer" },
            BACK: { target: "garagen" },
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
              { target: "#steps.gebaeude.garagenAnzahl", cond: "hasGaragen" },
              { target: "#steps.gebaeude.garagen", cond: "showGebaeude" },
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
