import type { CookieData } from "~/cookies";

export interface ConfigStepFieldCommon {
  name: string;
  label: string;
}

export interface ConfigStepFieldText extends ConfigStepFieldCommon {
  type: "text";
}

export interface ConfigStepFieldOptionsItem {
  value: string;
  label: string;
}

export interface ConfigStepFieldWithOptions extends ConfigStepFieldCommon {
  options: ConfigStepFieldOptionsItem[];
}

export interface ConfigStepFieldRadio extends ConfigStepFieldWithOptions {
  type: "radio";
}

export interface ConfigStepFieldSelect extends ConfigStepFieldWithOptions {
  type: "select";
}

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

const config: Config = {
  steps: [
    {
      name: "adresse",
      headline: "Lage des Grundstücks",
      fields: [
        {
          name: "strasse",
          type: "text",
          label: "Straße",
        },
        {
          name: "hausnummer",
          type: "text",
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
          type: "radio",
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
      condition: (records) => {
        return records?.bebauung?.bebauung === "bebaut";
      },
      fields: [
        {
          name: "gebaeudeart",
          type: "select",
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

export default config;
