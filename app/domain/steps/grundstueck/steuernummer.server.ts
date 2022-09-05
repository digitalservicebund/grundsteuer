import { StepDefinition } from "~/domain/steps/index.server";

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
