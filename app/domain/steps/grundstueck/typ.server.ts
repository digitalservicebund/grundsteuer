import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstueckTypFields = {
  typ:
    | "einfamilienhaus"
    | "zweifamilienhaus"
    | "wohnungseigentum"
    | "baureif"
    | "abweichendeEntwicklung";
};

export const grundstueckTyp: StepDefinition = {
  fields: {
    typ: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [
        { value: "einfamilienhaus" },
        { value: "zweifamilienhaus" },
        { value: "wohnungseigentum" },
        { value: "baureif" },
        { value: "abweichendeEntwicklung" },
      ],
    },
  },
};
