import { StepDefinition } from "~/domain/steps";
import { stepDefinition as adresseDefinition } from "~/domain/steps/shared/adresse";

export type { AdresseFields as EigentuemerEmpfangsbevollmaechtigterAdresseFields } from "../../shared/adresse";

export const eigentuemerEmpfangsbevollmaechtigterAdresse: StepDefinition = {
  fields: {
    ...adresseDefinition.fields,
    telefonnummer: {
      validations: {
        required: {},
        maxLength: {
          maxLength: 16,
          msg: "Die Angabe darf maximal 16 Zeichen beinhalten",
        },
      },
    },
  },
};
