import { StepDefinition } from "~/domain/steps";

export type ZusammenfassungFields = {
  freitext: string;
};

export const zusammenfassung: StepDefinition = {
  fields: {
    freitext: {
      validations: {
        maxLength: {
          // reserve some chars for possible two-Bodenrichtwert disclaimer
          maxLength: 900,
          msg: "Die Angabe darf höchstens 900 Zeichen lang sein",
        },
      },
    },
  },
};
