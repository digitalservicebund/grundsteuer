import { StepDefinition } from "~/domain/steps";

export type GebaeudeAbbruchverpflichtungsjahrFields = {
  abbruchverpflichtungsjahr: string;
};

export const gebaeudeAbbruchverpflichtungsjahrjahr: StepDefinition = {
  fields: {
    abbruchverpflichtungsjahr: { validations: {} },
  },
};
