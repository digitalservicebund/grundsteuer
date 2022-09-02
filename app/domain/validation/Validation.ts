import { Condition } from "~/domain/states/guards";

interface DefaultValidation {
  msg?: string;
}

export interface OnlyDecimalValidation extends DefaultValidation {
  exceptions?: string[];
}

export interface MinLengthFloatValidation extends DefaultValidation {
  preComma: number;
  postComma: number;
}

export interface MinLengthValidation extends DefaultValidation {
  minLength: number;
  exceptions?: string[];
}

export interface MaxLengthValidation extends DefaultValidation {
  maxLength: number;
  exceptions?: string[];
}

export interface MinValueValidation extends DefaultValidation {
  minValue: number;
}

interface YearInPastValidation extends DefaultValidation {
  excludingCurrentYear?: boolean;
}

export interface DependentValidation extends DefaultValidation {
  dependentField: string;
}

export interface RequiredIfConditionValidation extends DefaultValidation {
  condition: Condition;
}

export type Validation =
  | DefaultValidation
  | DependentValidation
  | OnlyDecimalValidation
  | RequiredIfConditionValidation
  | MaxLengthValidation
  | MinLengthValidation
  | MinLengthFloatValidation
  | MinValueValidation
  | YearInPastValidation;
