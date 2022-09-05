import { StepDefinition } from "~/domain/steps/index.server";
import {
  NameFields,
  stepDefinition as nameDefinition,
} from "~/domain/steps/shared/name.server";

export type EigentuemerPersonPersoenlicheAngabenFields = NameFields & {
  geburtsdatum: string;
};

export const eigentuemerPersonPersoenlicheAngaben: StepDefinition = {
  fields: {
    ...nameDefinition.fields,
    geburtsdatum: {
      validations: {
        required: {},
        isDate: {},
        dateInPast: {},
      },
    },
  },
};
