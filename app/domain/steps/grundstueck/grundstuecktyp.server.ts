import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstuecktypFields = {
  grundstuecktyp: "baureif" | "bauerwartungsland" | "rohbauland";
};

export const grundstuecktyp: StepDefinition = {
  fields: {
    grundstuecktyp: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [
        { value: "baureif" },
        { value: "bauerwartungsland" },
        { value: "rohbauland" },
      ],
    },
  },
};
