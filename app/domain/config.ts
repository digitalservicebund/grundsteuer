import type { CookieData } from "~/cookies";
import { Validation } from "~/domain/validation";

interface ConfigStepFieldCommon {
  name: string;
  label: string;
}

export interface ConfigStepFieldValidation {
  name: string;
  label: string;
  validations: Record<string, Validation>;
}

export type ConfigStepFieldText = ConfigStepFieldCommon;

export interface ConfigStepFieldOptionsItem {
  value: string;
  label: string;
}

export interface ConfigStepFieldWithOptions extends ConfigStepFieldCommon {
  options: ConfigStepFieldOptionsItem[];
}

export type ConfigStepFieldRadio = ConfigStepFieldWithOptions;

export type ConfigStepFieldSelect = ConfigStepFieldWithOptions;

export interface ConfigStepConditionFunction {
  (records: Pick<CookieData, "records"> | any): boolean;
}

export type ConfigStepField =
  | ConfigStepFieldText
  | ConfigStepFieldSelect
  | ConfigStepFieldRadio;

export interface ConfigStep {
  name: string;
  headline: string;
  fields: ConfigStepField[];
  condition?: ConfigStepConditionFunction;
}

export interface Config {
  steps: ConfigStep[];
}

// TODO remove/replace this

export const config: Config = {
  steps: [
    {
      name: "adresse",
      headline: "Lage des Grundstücks",
      fields: [
        {
          name: "strasse",
          label: "Straße",
        },
        {
          name: "hausnummer",
          label: "Hausnummer",
        },
      ],
    },
    {
      name: "bebauung",
      headline: "Bebauung des Grundstücks",
      fields: [
        {
          name: "bebauung",
          label: "Das Grundstück ist",
          options: [
            {
              value: "unbebaut",
              label: "unbebaut",
            },
            {
              value: "bebaut",
              label: "bebaut",
            },
          ],
        },
      ],
    },
    {
      name: "gebaeude",
      headline: "Gebäude auf dem Grundstück",
      fields: [
        {
          name: "gebaeudeart",
          label: "Art des Gebäudes",
          options: [
            {
              value: "einfamilienhaus",
              label: "Einfamilienhaus",
            },
            {
              value: "reihenhaus",
              label: "Reihenhaus",
            },
            {
              value: "mehrfamilienhaus",
              label: "Mehrfamilienhaus",
            },
          ],
        },
      ],
    },
  ],
};
