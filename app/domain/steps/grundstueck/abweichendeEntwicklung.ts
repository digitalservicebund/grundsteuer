import { StepDefinition } from "~/domain/steps";

export type GrundstueckAbweichendeEntwicklungFields = {
  zustand: "bauerwartungsland" | "rohbauland";
};

export const grundstueckAbweichendeEntwicklung: StepDefinition = {
  fields: {
    zustand: {
      type: "radio",
      validations: {},
      options: [{ value: "bauerwartungsland" }, { value: "rohbauland" }],
    },
  },
};
