import { GrundDataModelData } from "./model";
import { personAdresseFields } from "~/routes/formular/eigentuemer/person/$id.adresse";

export interface StateMachineContext extends GrundDataModelData {
  currentId?: number;
}

export const steps = {
  id: "steps",
  initial: "eigentuemer",
  states: {
    eigentuemer: {
      id: "eigentuemer",
      initial: "anzahl",
      states: {
        anzahl: {
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
              on: {
                NEXT: [
                  {
                    target: "#person",
                    cond: "hasNotGesetzlicherVertreterAndRepeatPerson",
                    actions: ["incrementCurrentId"],
                  },
                  {
                    target: "gesetzlicherVertreterDaten",
                    cond: "hasGesetzlicherVertreter",
                  },
                  {
                    target: "#steps.grundstueck",
                  },
                ],
              },
            },
            gesetzlicherVertreterDaten: {
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
  return Object.assign({}, steps, { context: records });
};
