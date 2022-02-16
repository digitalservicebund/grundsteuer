import { Validation } from "~/domain/validation";

interface ConfigStepFieldCommon {
  name: string;
  label?: string;
  validations: Record<string, Validation>;
}

export type ConfigStepFieldText = ConfigStepFieldCommon;

export interface ConfigStepFieldOptionsItem {
  value: string;
  label?: string;
}

export interface ConfigStepFieldWithOptions extends ConfigStepFieldCommon {
  options: ConfigStepFieldOptionsItem[];
}

export type ConfigStepFieldRadio = ConfigStepFieldWithOptions;

export type ConfigStepFieldSelect = ConfigStepFieldWithOptions;

export type ConfigStepField =
  | ConfigStepFieldText
  | ConfigStepFieldSelect
  | ConfigStepFieldRadio;
