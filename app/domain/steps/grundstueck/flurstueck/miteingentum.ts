import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckMiteigentumFields = {
  hasMiteigentum: "true" | "false";
};

export const grundstueckFlurstueckMiteigentum: StepDefinition = {
  fields: {
    hasMiteigentum: {
      type: "radio",
      validations: {
        required: {},
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
