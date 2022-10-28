import { StepFormData } from "~/domain/model";
import {
  GrundModel,
  Bundesland,
  GrundstueckFlurstueckGroesseFields,
} from "~/domain/steps/index.server";
import { PruefenModel } from "~/domain/pruefen/model";
import { ValidateFunction } from "~/domain/validation/ValidateFunction";
import { validateFreischaltCode } from "~/domain/validation/fscValidation";
import {
  validateSteuerId,
  validateUniqueSteuerId,
} from "~/domain/validation/steuerIdValidation";
import { validateSteuernummer } from "~/domain/validation/validateSteuernummer";
import {
  DependentValidation,
  MaxLengthValidation,
  MinLengthFloatValidation,
  MinLengthValidation,
  MinValueValidation,
  OnlyDecimalValidation,
  RequiredIfConditionValidation,
  YearInPastValidation,
} from "~/domain/validation/Validation";
import { ValidationConfig } from "~/domain/validation";
import {
  validateBiggerThan,
  validateFloat,
  validateMinValue,
  validateNoZero,
  validateOnlyDecimal,
} from "~/domain/validation/numericValidation";
import {
  validateElsterChars,
  validateEmail,
  validateMaxLength,
  validateMaxLengthFloat,
  validateMinLength,
} from "~/domain/validation/stringValidation";
import {
  validateDateInPast,
  validateIsDate,
  validateYearAfterBaujahr,
  validateYearInFuture,
  validateYearInPast,
} from "~/domain/validation/dateValidation";
import {
  validateFlurstueckGroesse,
  validateFlurstueckGroesseLength,
  validateFlurstueckGroesseRequired,
} from "~/domain/validation/flurstueckValidation";
import {
  validateEitherOr,
  validateForbiddenIf,
  validateRequired,
  validateRequiredIf,
  validateRequiredIfCondition,
} from "~/domain/validation/requiredValidation";
import { validateHausnummer } from "~/domain/validation/validateHausnummer";
import { validateGrundbuchblattnummer } from "~/domain/validation/validateGrundbuchblattnummer";

const FALLBACK_ERROR_MESSAGE = "Die Eingabe ist ungültig.";

export const getErrorMessage = (
  value: string,
  validationConfig: ValidationConfig,
  formData: StepFormData,
  allData: GrundModel | PruefenModel,
  i18n: Record<string, Record<string, string> | string>,
  noNewDataAdded?: boolean
): string | undefined => {
  const validatorMapping: Record<string, ValidateFunction> = {
    required: validateRequired,
    requiredIf: validateRequiredIf,
    requiredIfCondition: validateRequiredIfCondition,
    uniqueSteuerId: validateUniqueSteuerId,
    email: validateEmail,
    onlyDecimal: validateOnlyDecimal,
    isDate: validateIsDate,
    isFreischaltCode: validateFreischaltCode,
    isSteuerId: validateSteuerId,
    noZero: validateNoZero,
    float: validateFloat,
    maxLengthFloat: validateMaxLengthFloat,
    maxLength: validateMaxLength,
    minLength: validateMinLength,
    minValue: validateMinValue,
    forbiddenIf: validateForbiddenIf,
    eitherOr: validateEitherOr,
    yearAfterBaujahr: validateYearAfterBaujahr,
    biggerThan: validateBiggerThan,
    hausnummer: validateHausnummer,
    grundbuchblattnummer: validateGrundbuchblattnummer,
    flurstueckGroesse: validateFlurstueckGroesse,
    flurstueckGroesseLength: validateFlurstueckGroesseLength,
    flurstueckGroesseRequired: validateFlurstueckGroesseRequired,
    yearInFuture: validateYearInFuture,
    yearInPast: validateYearInPast,
    dateInPast: validateDateInPast,
    steuernummer: validateSteuernummer,
  };

  if (!validateElsterChars({ value })) {
    return i18n.elsterChars as string;
  }

  for (const [key, validation] of Object.entries(validationConfig)) {
    const validateFunction = validatorMapping[key];

    const dependentValue = formData[
      (validation as DependentValidation).dependentField
    ] as string;
    const maxLength = (validation as MaxLengthValidation).maxLength;
    const minLength = (validation as MinLengthValidation).minLength;
    const minValue = (validation as MinValueValidation).minValue;
    const preComma = (validation as MinLengthFloatValidation).preComma;
    const postComma = (validation as MinLengthFloatValidation).postComma;
    const condition = (validation as RequiredIfConditionValidation).condition;
    const exceptions = (validation as OnlyDecimalValidation).exceptions;
    const excludingCurrentYear = (validation as YearInPastValidation)
      .excludingCurrentYear;
    const valueHa = (formData as GrundstueckFlurstueckGroesseFields).groesseHa;
    const valueA = (formData as GrundstueckFlurstueckGroesseFields).groesseA;
    const valueQm = (formData as GrundstueckFlurstueckGroesseFields).groesseQm;

    if (
      validateFunction &&
      !validateFunction({
        value,
        dependentValue,
        condition,
        exceptions,
        allData,
        maxLength,
        minLength,
        minValue,
        preComma,
        postComma,
        valueHa,
        valueA,
        valueQm,
        noNewDataAdded,
        excludingCurrentYear,
      })
    ) {
      return (
        validation.msg ||
        getMsgFromI18n(key, allData, i18n) ||
        FALLBACK_ERROR_MESSAGE
      );
    }
  }
};

const getMsgFromI18n = (
  key: string,
  allData: GrundModel | PruefenModel,
  i18n: Record<string, Record<string, string> | string>
) => {
  if (isBundeslandSpecific(key)) {
    const selectedBundesland = (allData as GrundModel)?.grundstueck?.adresse
      ?.bundesland;
    const bundesland = selectedBundesland || "default";
    return (
      (i18n[key] as Record<string, string>)[bundesland as Bundesland] ||
      (i18n[key] as Record<string, string>)["default"]
    );
  }
  return i18n[key] as string;
};

const isBundeslandSpecific = (key: string) => {
  return ["steuernummer"].includes(key);
};
