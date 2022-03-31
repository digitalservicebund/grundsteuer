import { StepDefinition } from "~/domain/steps";

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
        required: {},
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
