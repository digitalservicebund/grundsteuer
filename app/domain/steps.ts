import { GrundDataModelData } from "./model";

export const steps = {
  id: "steps",
  initial: "legacy",
  states: {
    legacy: {
      id: "legacy",
      initial: "adresse",
      states: {
        adresse: {
          on: {
            NEXT: [
              {
                target: "bebauung",
              },
            ],
          },
        },
        bebauung: {
          on: {
            NEXT: [
              {
                target: "gebaeude",
                cond: "isBebaut",
              },
              {
                target: "zusammenfassung",
              },
            ],
          },
        },
        gebaeude: {
          on: {
            NEXT: [
              {
                target: "zusammenfassung",
              },
            ],
          },
        },
        zusammenfassung: { on: { NEXT: "#steps.metadaten" } },
      },
    },
    metadaten: { on: { NEXT: "eigentuemer" } },
    eigentuemer: {
      id: "eigentuemer",
      initial: "uebersicht",
      states: {
        uebersicht: { on: { NEXT: "person" } },
        person: {
          id: "person",
          initial: "persoenlicheAngaben",
          meta: { resource: true },
          states: {
            persoenlicheAngaben: {
              meta: { title: "Persönliche Angaben" },
              on: { NEXT: "adresse" },
            },
            adresse: { on: { NEXT: "telefonnummer" } },
            telefonnummer: { on: { NEXT: "steuerId" } },
            steuerId: { on: { NEXT: "anteilGrundstueck" } },
            anteilGrundstueck: { on: { NEXT: "gesetzlicherVertreter" } },
            gesetzlicherVertreter: { on: { NEXT: "#steps.grundstueck" } },
          },
        },
      },
    },
    grundstueck: {
      id: "grundstueck",
      initial: "adresse",
      states: {
        adresse: { on: { NEXT: "aktenzeichen" } },
        aktenzeichen: { on: { NEXT: "finanzamt" } },
        finanzamt: { on: { NEXT: "grundstuecksart" } },
        grundstuecksart: {
          on: {
            NEXT: [
              {
                target: "unbebaut",
                cond: "isUnbebaut",
              },
              {
                target: "bebaut",
                cond: "isBebaut",
              },
            ],
          },
        },
        unbebaut: {
          id: "unbebaut",
          initial: "entwicklung",
          meta: { visibilityCond: "isUnbebaut" },
          states: {
            entwicklung: {
              on: { NEXT: "bauland" },
            },
            bauland: { on: { NEXT: "#grundstueck.mehrereGemeinden" } },
          },
        },
        bebaut: {
          id: "bebaut",
          initial: "something",
          meta: { visibilityCond: "isBebaut" },
          states: {
            something: { on: { NEXT: "#grundstueck.mehrereGemeinden" } },
          },
        },
        mehrereGemeinden: { on: { NEXT: "grundbuchblatt" } },
        grundbuchblatt: { on: { NEXT: "#steps.gebaeude" } },
      },
    },
    gebaeude: { on: { NEXT: "zusammenfassung" } },
    zusammenfassung: { type: "final" },
  },
};

export const getMachineConfig = (records: GrundDataModelData) => {
  return Object.assign({}, steps, { context: records });
};
