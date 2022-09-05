import { Condition } from "~/domain/states/guards";
import { PruefenCondition } from "~/domain/pruefen/guards";
import { GrundModel } from "~/domain/steps/index.server";
import { PruefenModel } from "~/domain/pruefen/model";
import { ValidateSteuernummer } from "~/domain/validation/validateSteuernummer";

export type ValidateFunction =
  | ValidateFunctionDefault
  | ValidateOnlyDecimalFunction
  | ValidateDependentFunction
  | ValidateRequiredIfConditionFunction
  | ValidateUniqueSteuerIdFunction
  | ValidateMaxLengthFunction
  | ValidateMinLengthFunction
  | ValidateMaxLengthFloatFunction
  | ValidateFlurstueckGroesseFunction
  | ValidateMinValueFunction
  | ValidateYearAfterBaujahrFunction
  | ValidateYearInPast
  | ValidateSteuernummer;

export type ValidateFunctionDefault = ({ value }: { value: string }) => boolean;

export type ValidateOnlyDecimalFunction = ({
  value,
  exceptions,
}: {
  value: string;
  exceptions?: Array<string>;
}) => boolean;

export type ValidateMaxLengthFloatFunction = ({
  value,
  preComma,
  postComma,
}: {
  value: string;
  preComma: number;
  postComma: number;
}) => boolean;

export type ValidateMinLengthFunction = ({
  value,
  minLength,
  exceptions,
}: {
  value: string;
  minLength: number;
  exceptions?: string[];
}) => boolean;

export type ValidateMaxLengthFunction = ({
  value,
  maxLength,
  exceptions,
}: {
  value: string;
  maxLength: number;
  exceptions?: string[];
}) => boolean;

export type ValidateDependentFunction = ({
  value,
  dependentValue,
}: {
  value: string;
  dependentValue?: string;
}) => boolean;

export type ValidateRequiredIfConditionFunction = ({
  value,
  condition,
  allData,
}: {
  value: string;
  condition: Condition | PruefenCondition;
  allData: GrundModel | PruefenModel;
}) => boolean;

export type ValidateUniqueSteuerIdFunction = ({
  value,
  allData,
  noNewDataAdded,
}: {
  value?: string;
  allData: GrundModel | PruefenModel;
  noNewDataAdded?: boolean;
}) => boolean;

export type ValidateYearAfterBaujahrFunction = ({
  value,
  allData,
}: {
  value: string;
  allData: GrundModel;
}) => boolean;

export type ValidateFlurstueckGroesseFunction = ({
  valueHa,
  valueA,
  valueQm,
}: {
  valueHa: string;
  valueA: string;
  valueQm: string;
}) => boolean;

export type ValidateMinValueFunction = ({
  value,
  minValue,
}: {
  value: string;
  minValue: number;
}) => boolean;

export type ValidateYearInPast = ({
  value,
  excludingCurrentYear,
}: {
  value: string;
  excludingCurrentYear?: boolean;
}) => boolean;
