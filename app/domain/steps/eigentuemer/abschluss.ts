import { StepDefinition } from "~/domain/steps/index.server";

export type EigentuemerAbschlussFields = {
  freitext?: string;
};

export const eigentuemerAbschluss: StepDefinition = {
  optional: true,
  fields: {
    freitext: {
      type: "textarea",
      validations: {
        maxLength: {
          // reserve some chars for possible two-Bodenrichtwert disclaimer
          maxLength: 900,
          msg: "Die Angabe darf höchstens 900 Zeichen lang sein",
        },
      },
      htmlAttributes: {
        maxLength: 900,
      },
    },
  },
};
