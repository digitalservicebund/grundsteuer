import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstueckAbweichendeEntwicklungFields = {
  zustand: "bauerwartungsland" | "rohbauland";
};

export const grundstueckAbweichendeEntwicklung: StepDefinition = {
  fields: {
    zustand: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "bauerwartungsland" }, { value: "rohbauland" }],
    },
  },
};
