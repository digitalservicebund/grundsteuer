import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeAbbruchverpflichtungFields = {
  hasAbbruchverpflichtung: "true" | "false";
};

export const gebaeudeAbbruchverpflichtung: StepDefinition = {
  fields: {
    hasAbbruchverpflichtung: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
