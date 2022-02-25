import { StepDefinition } from "~/domain/steps";
import {
  NameFields,
  stepDefinition as nameDefinition,
} from "~/domain/steps/shared/name";

export type EigentuemerPersonPersoenlicheAngabenFields = NameFields & {
  geburtsdatum: string;
};

export const eigentuemerPersonPersoenlicheAngaben: StepDefinition = {
  fields: {
    ...nameDefinition.fields,
    geburtsdatum: { validations: {} },
  },
};
