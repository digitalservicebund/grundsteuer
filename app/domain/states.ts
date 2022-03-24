import { MachineConfig } from "xstate";
import { GrundModel } from "./steps";

export interface StateMachineContext extends GrundModel {
  personId?: number;
  flurstueckId?: number;
}

export const states: MachineConfig<any, any, any> = {
  id: "steps",
  initial: "grundstueck",
  states: {
    grundstueck: {
      id: "grundstueck",
      initial: "adresse",
      states: {
        adresse: {
          on: {
            NEXT: [{ target: "steuernummer" }],
          },
        },
        steuernummer: {
          on: {
            NEXT: [{ target: "typ" }],
            BACK: [{ target: "adresse" }],
          },
        },
        typ: {
          on: {
            NEXT: [
              {
                target: "abweichendeEntwicklung",
                cond: "isAbweichendeEntwicklung",
              },
              { target: "gemeinde" },
            ],
            BACK: [{ target: "steuernummer" }],
          },
        },
        abweichendeEntwicklung: {
          on: {
            NEXT: [{ target: "gemeinde" }],
            BACK: [{ target: "typ" }],
          },
        },
        gemeinde: {
          on: {
            NEXT: [{ target: "anzahl" }],
            BACK: [
              {
                target: "abweichendeEntwicklung",
                cond: "isAbweichendeEntwicklung",
              },
              { target: "typ" },
            ],
          },
        },
        anzahl: {
          on: {
            NEXT: [{ target: "flurstueck" }],
            BACK: [{ target: "gemeinde" }],
          },
        },
        flurstueck: {
          id: "flurstueck",
          initial: "angaben",
          states: {
            angaben: {
              on: {
                NEXT: [{ target: "flur" }],
                BACK: [
                  {
                    target: "groesse",
                    cond: "flurstueckIdGreaterThanOne",
                    actions: ["decrementFlurstueckId"],
                  },
                  { target: "#grundstueck.anzahl" },
                ],
              },
            },
            flur: {
              on: {
                NEXT: [{ target: "groesse" }],
                BACK: [{ target: "angaben" }],
              },
            },
            groesse: {
              on: {
                NEXT: [
                  {
                    target: "angaben",
                    cond: "repeatFlurstueck",
                    actions: ["incrementFlurstueckId"],
                  },
                  { target: "#grundstueck.bodenrichtwert" },
                ],
                BACK: [{ target: "flur" }],
              },
            },
          },
        },
        bodenrichtwert: {
          on: {
            NEXT: [
              { target: "#steps.gebaeude", cond: "isBebaut" },
              { target: "#steps.eigentuemer" },
            ],
            BACK: [
              {
                target: "#flurstueck.groesse",
                actions: "setFlurstueckIdToMaximum",
              },
            ],
          },
        },
      },
    },
    gebaeude: {
      id: "gebaeude",
      initial: "ab1949",
      states: {
        ab1949: {
          on: {
            NEXT: [
              { target: "baujahr", cond: "isBezugsfertigAb1949" },
              { target: "kernsaniert" },
            ],
            BACK: {
              target: "#grundstueck.bodenrichtwert",
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
              { target: "abbruchverpflichtung" },
            ],
            BACK: [
              { target: "baujahr", cond: "isBezugsfertigAb1949" },
              { target: "ab1949" },
            ],
          },
        },
        kernsanierungsjahr: {
          on: {
            NEXT: [{ target: "abbruchverpflichtung" }],
            BACK: [{ target: "kernsaniert" }],
          },
        },
        abbruchverpflichtung: {
          on: {
            NEXT: [
              {
                target: "abbruchverpflichtungsjahr",
                cond: "hasAbbruchverpflichtung",
              },
              { target: "wohnflaechen", cond: "isZweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
            BACK: [
              { target: "kernsanierungsjahr", cond: "isKernsaniert" },
              { target: "kernsaniert" },
            ],
          },
        },
        abbruchverpflichtungsjahr: {
          on: {
            NEXT: [
              { target: "wohnflaechen", cond: "isZweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
            BACK: [{ target: "abbruchverpflichtung" }],
          },
        },
        wohnflaeche: {
          on: {
            NEXT: {
              target: "weitereWohnraeume",
            },
            BACK: [
              {
                target: "abbruchverpflichtungsjahr",
                cond: "hasAbbruchverpflichtung",
              },
              { target: "abbruchverpflichtung" },
            ],
          },
        },
        wohnflaechen: {
          on: {
            NEXT: {
              target: "weitereWohnraeume",
            },
            BACK: [
              {
                target: "abbruchverpflichtungsjahr",
                cond: "hasAbbruchverpflichtung",
              },
              { target: "abbruchverpflichtung" },
            ],
          },
        },
        weitereWohnraeume: {
          on: {
            NEXT: [
              {
                target: "weitereWohnraeumeDetails",
                cond: "hasWeitereWohnraeume",
              },
              { target: "garagen" },
            ],
            BACK: [
              { target: "wohnflaechen", cond: "isZweifamilienhaus" },
              { target: "wohnflaeche" },
            ],
          },
        },
        weitereWohnraeumeDetails: {
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
                target: "weitereWohnraeumeDetails",
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
              { target: "#steps.gebaeude.garagen", cond: "isBebaut" },
              { target: "#steps.grundstueck.bodenrichtwert" },
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
                    cond: "personIdGreaterThanOne",

                    actions: ["decrementPersonId"],
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
                  { target: "anteil", cond: "hasMultipleEigentuemer" },
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
                NEXT: { target: "anteil", cond: "hasMultipleEigentuemer" },
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
            NEXT: [
              {
                target: "person",
                cond: "repeatPerson",
                actions: ["incrementPersonId"],
              },
              {
                target: "bruchteilsgemeinschaft",
                cond: "isBruchteilsgemeinschaft",
              },
              { target: "empfangsvollmacht" },
            ],
          },
        },
        bruchteilsgemeinschaft: {
          on: {
            BACK: [
              {
                target: "person.anteil",
                cond: "hasMultipleEigentuemer",
                actions: "setPersonIdToMaximum",
              },
              {
                target: "person.vertreter.telefonnummer",
                cond: "hasGesetzlicherVertreter",
                actions: "setPersonIdToMaximum",
              },
              {
                target: "person.gesetzlicherVertreter",
                actions: "setPersonIdToMaximum",
              },
            ],
            NEXT: [
              {
                target: "bruchteilsgemeinschaftangaben.angaben",
                cond: "customBruchteilsgemeinschaftData",
              },
              { target: "empfangsvollmacht" },
            ],
          },
        },
        bruchteilsgemeinschaftangaben: {
          states: {
            angaben: {},
          },
          on: {
            BACK: {
              target: "bruchteilsgemeinschaft",
              actions: "setPersonIdToMaximum",
            },
            NEXT: { target: "empfangsvollmacht" },
          },
        },
        empfangsvollmacht: {
          on: {
            BACK: [
              {
                target: "bruchteilsgemeinschaftangaben.angaben",
                cond: "customBruchteilsgemeinschaftData",
              },
              {
                target: "bruchteilsgemeinschaft",
                cond: "isBruchteilsgemeinschaft",
              },
              {
                target: "person.anteil",
                cond: "hasMultipleEigentuemer",
                actions: "setPersonIdToMaximum",
              },
              {
                target: "person.vertreter.telefonnummer",
                cond: "hasGesetzlicherVertreter",
                actions: "setPersonIdToMaximum",
              },
              {
                target: "person.gesetzlicherVertreter",
                actions: "setPersonIdToMaximum",
              },
            ],
            NEXT: [
              {
                target: "empfangsbevollmaechtigter",
                cond: "hasEmpfangsbevollmaechtigter",
              },
              { target: "freitext" },
            ],
          },
        },
        empfangsbevollmaechtigter: {
          id: "empfangsbevollmaechtigter",
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
            NEXT: { target: "freitext" },
            BACK: { target: "empfangsvollmacht" },
          },
        },
        freitext: {
          on: {
            BACK: [
              {
                target: "empfangsbevollmaechtigter.telefonnummer",
                cond: "hasEmpfangsbevollmaechtigter",
              },
              { target: "empfangsvollmacht" },
            ],
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
        BACK: { target: "eigentuemer.freitext" },
      },
    },
  },
};

export type StateMachineConfig = typeof states;

export const getMachineConfig = (records: StateMachineContext) => {
  return Object.assign({}, states, { context: records });
};
