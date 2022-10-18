import { StepDefinition } from "~/domain/steps/index.server";

export type NameFields = {
  anrede: "no_anrede" | "frau" | "herr";
  titel: string;
  vorname: string;
  name: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    anrede: {
      type: "select",
      validations: {
        required: {},
      },
      options: [
        { value: "Bitte auswählen", defaultOption: true },
        { value: "no_anrede" },
        { value: "frau" },
        { value: "herr" },
      ],
    },
    titel: {
      validations: {
        maxLength: {
          maxLength: 15,
          msg: "Die Angabe darf maximal 15 Zeichen lang sein",
        },
      },
    },
    vorname: {
      validations: {
        required: {},
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen lang sein",
        },
      },
    },
    name: {
      validations: {
        required: {},
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen lang sein",
        },
      },
    },
  },
};
