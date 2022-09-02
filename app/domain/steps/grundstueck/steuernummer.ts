import { StepDefinition } from "~/domain/steps";

export type GrundstueckSteuernummerFields = {
  steuernummer: string;
};

export const grundstueckSteuernummer: StepDefinition = {
  fields: {
    steuernummer: {
      type: "steuernummer",
      validations: {
        required: {},
        onlyDecimal: {
          exceptions: [" ", "/", "-", "."],
        },
        steuernummer: {},
      },
    },
  },
};
