import { StepDefinition } from "~/domain/steps/index.server";

export type HaustypFields = {
  haustyp: "einfamilienhaus" | "zweifamilienhaus" | "wohnungseigentum";
};

export const haustyp: StepDefinition = {
  fields: {
    haustyp: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [
        { value: "einfamilienhaus" },
        { value: "zweifamilienhaus" },
        { value: "wohnungseigentum" },
      ],
    },
  },
};
