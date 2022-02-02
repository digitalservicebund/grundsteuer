import type { CookieData } from "~/cookies";

interface ConfigStepFieldCommon {
  name: string;
  label: string;
  type: FieldType;
}

export enum FieldType {
  Text,
  Radio,
  Select,
}

export interface ConfigStepFieldText extends ConfigStepFieldCommon {
  type: FieldType.Text;
}

export interface ConfigStepFieldOptionsItem {
  value: string;
  label: string;
}

export interface ConfigStepFieldWithOptions extends ConfigStepFieldCommon {
  options: ConfigStepFieldOptionsItem[];
}

export interface ConfigStepFieldRadio extends ConfigStepFieldWithOptions {
  type: FieldType.Radio;
}

export interface ConfigStepFieldSelect extends ConfigStepFieldWithOptions {
  type: FieldType.Select;
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

export const config: Config = {
  steps: [
    {
      name: "adresse",
      headline: "Lage des Grundstücks",
      fields: [
        {
          name: "strasse",
          type: FieldType.Text,
          label: "Straße",
        },
        {
          name: "hausnummer",
          type: FieldType.Text,
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
          type: FieldType.Radio,
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
          type: FieldType.Select,
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
