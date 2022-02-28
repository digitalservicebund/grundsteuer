import { StepDefinition } from "~/domain/steps";

export type GebaeudeKernsaniertFields = {
  isKernsaniert: "true" | "false";
};

export const gebaeudeKernsaniert: StepDefinition = {
  fields: {
    isKernsaniert: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
