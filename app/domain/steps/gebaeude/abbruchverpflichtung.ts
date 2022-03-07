import { StepDefinition } from "~/domain/steps";

export type GebaeudeAbbruchverpflichtungFields = {
  hasAbbruchverpflichtung: "true" | "false";
};

export const gebaeudeAbbruchverpflichtung: StepDefinition = {
  fields: {
    hasAbbruchverpflichtung: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
