import type { CookieData } from "~/cookies";
import { Validation } from "~/domain/validation";

interface ConfigStepFieldCommon {
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
  steps: [],
};
