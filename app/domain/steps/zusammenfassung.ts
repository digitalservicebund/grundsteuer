import { StepDefinition } from "~/domain/steps";

export type ZusammenfassungFields = {
  freitext?: string;
  confirmCompleteCorrect: string;
  confirmDataPrivacy: string;
  confirmTermsOfUse: string;
};

export const zusammenfassung: StepDefinition = {
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
    confirmCompleteCorrect: {
      type: "checkbox",
      validations: {
        required: {},
      },
    },
    confirmDataPrivacy: {
      type: "checkbox",
      validations: {
        required: {},
      },
    },
    confirmTermsOfUse: {
      type: "checkbox",
      validations: {
        required: {},
      },
    },
  },
};
