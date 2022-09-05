import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeAb1949Fields = {
  isAb1949: "true" | "false";
};

export const gebaeudeAb1949: StepDefinition = {
  fields: {
    isAb1949: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
