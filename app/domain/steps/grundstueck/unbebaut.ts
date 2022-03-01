import { StepDefinition } from "~/domain/steps";

export type GrundstueckUnbebautFields = {
  zustand: "bauerwartungsland" | "rohbauland";
};

export const grundstueckUnbebaut: StepDefinition = {
  fields: {
    zustand: {
      type: "radio",
      validations: {},
      options: [{ value: "bauerwartungsland" }, { value: "rohbauland" }],
    },
  },
};
