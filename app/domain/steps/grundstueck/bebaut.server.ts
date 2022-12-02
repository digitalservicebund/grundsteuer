import { StepDefinition } from "~/domain/steps/index.server";

export type BebautFields = {
  bebaut: "bebaut" | "unbebaut" | "baureif";
};

export const bebaut: StepDefinition = {
  fields: {
    bebaut: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [
        { value: "bebaut" },
        { value: "unbebaut" },
        { value: "baureif" },
      ],
    },
  },
};
