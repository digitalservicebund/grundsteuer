import { StepDefinition } from "~/domain/steps/index.server";

export type ZusammenfassungFields = {
  confirmCompleteCorrect: string;
  confirmDataPrivacy: string;
  confirmTermsOfUse: string;
  includePdfInMail?: string;
};

export const zusammenfassung: StepDefinition = {
  fields: {
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
    includePdfInMail: {
      type: "checkbox",
      validations: {},
    },
  },
};
