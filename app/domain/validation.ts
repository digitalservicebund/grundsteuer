import { getStepData, idToIndex, StepFormData } from "~/domain/model";
import validator from "validator";
import { Condition } from "~/domain/guards";
import stepDefinitions, {
  getStepDefinition,
  GrundModel,
  GrundstueckFlurstueckGroesseFields,
  StepDefinitionField,
  StepDefinitionFieldWithOptions,
} from "~/domain/steps";
import { getReachablePathsFromData } from "~/domain/graph";
import _ from "lodash";
import { i18Next } from "~/i18n.server";
import { getCurrentStateWithoutId } from "~/util/getCurrentState";
import { GeneralErrors } from "~/routes/formular/zusammenfassung";

type ValidateFunctionDefault = ({ value }: { value: string }) => boolean;

const SUPPORTED_CHARS = [
  "\n",
  "",
  " ",
  "!",
  '"',
  "#",
  "$",
  "%",
  "&",
  "'",
  "(",
  ")",
  "*",
  "+",
  ",",
  "-",
  ".",
  "/",
  "\\",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "[",
  "]",
  "^",
  "_",
  "`",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "{",
  "|",
  "}",
  "~",
  "¡",
  "¢",
  "£",
  "¥",
  "§",
  "ª",
  "«",
  "¬",
  "®",
  "¯",
  "°",
  "±",
  "²",
  "³",
  "µ",
  "¹",
  "º",
  "»",
  "¿",
  "À",
  "Á",
  "Â",
  "Ã",
  "Ä",
  "Å",
  "Æ",
  "Ç",
  "È",
  "É",
  "Ê",
  "Ë",
  "Ì",
  "Í",
  "Î",
  "Ï",
  "Ð",
  "Ñ",
  "Ò",
  "Ó",
  "Ô",
  "Õ",
  "Ö",
  "×",
  "Ø",
  "Ù",
  "Ú",
  "Û",
  "Ü",
  "Ý",
  "Þ",
  "ß",
  "à",
  "á",
  "â",
  "ã",
  "ä",
  "å",
  "æ",
  "ç",
  "è",
  "é",
  "ê",
  "ë",
  "ì",
  "í",
  "î",
  "ï",
  "ð",
  "ñ",
  "ò",
  "ó",
  "ô",
  "õ",
  "ö",
  "÷",
  "ø",
  "ù",
  "ú",
  "û",
  "ü",
  "ý",
  "þ",
  "ÿ",
  "Œ",
  "œ",
  "Š",
  "š",
  "Ÿ",
  "Ž",
  "ž",
  "€",
];

type ValidateFunction =
  | ValidateFunctionDefault
  | ValidateOnlyDecimalFunction
  | ValidateDependentFunction
  | ValidateRequiredIfConditionFunction
  | ValidateMaxLengthFunction
  | ValidateMinLengthFunction
  | ValidateMaxLengthFloatFunction
  | ValidateFlurstueckGroesseFunction
  | ValidateMinValueFunction
  | ValidateYearAfterBaujahrFunction
  | ValidateYearInPast;

export const validateElsterChars: ValidateFunctionDefault = ({ value }) =>
  Array.from(value).every((char) => SUPPORTED_CHARS.includes(char));

export const validateEmail: ValidateFunctionDefault = ({ value }) =>
  validator.isEmail(value);

type ValidateOnlyDecimalFunction = ({
  value,
  exceptions,
}: {
  value: string;
  exceptions?: Array<string>;
}) => boolean;
export const validateOnlyDecimal: ValidateOnlyDecimalFunction = ({
  value,
  exceptions,
}) => {
  if (!value) return true;
  let valueWithoutExceptions = value;
  exceptions?.forEach(
    (exception) =>
      (valueWithoutExceptions = valueWithoutExceptions
        .split(exception)
        .join(""))
  );
  return /^\d*$/.test(valueWithoutExceptions.trim());
};

export const validateIsDate: ValidateFunctionDefault = ({ value }) =>
  !value ||
  validator.isDate(value.trim(), {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });

export const validateNoZero: ValidateFunctionDefault = ({ value }) =>
  value != "0";

export const validateFloat: ValidateFunctionDefault = ({ value }) =>
  !value || validator.isFloat(value.trim(), { locale: "de-DE" });

type ValidateMaxLengthFloatFunction = ({
  value,
  preComma,
  postComma,
}: {
  value: string;
  preComma: number;
  postComma: number;
}) => boolean;
export const validateMaxLengthFloat: ValidateMaxLengthFloatFunction = ({
  value,
  preComma,
  postComma,
}) => {
  if (!value) return true;
  const splitValues = value.trim().split(",");
  return (
    splitValues[0].length <= preComma &&
    (!splitValues[1] || splitValues[1].length <= postComma)
  );
};

const removeAllExceptions = (value: string, exceptions?: string[]) => {
  exceptions?.forEach((exception) => (value = value.split(exception).join("")));
  return value;
};

type ValidateMinLengthFunction = ({
  value,
  minLength,
  exceptions,
}: {
  value: string;
  minLength: number;
  exceptions?: string[];
}) => boolean;
export const validateMinLength: ValidateMinLengthFunction = ({
  value,
  minLength,
  exceptions,
}) => {
  if (!value) return true;
  const valueWithoutExceptions = removeAllExceptions(value, exceptions);
  return valueWithoutExceptions.trim().length >= minLength;
};

type ValidateMaxLengthFunction = ({
  value,
  maxLength,
  exceptions,
}: {
  value: string;
  maxLength: number;
  exceptions?: string[];
}) => boolean;
export const validateMaxLength: ValidateMaxLengthFunction = ({
  value,
  maxLength,
  exceptions,
}) => {
  if (!value) return true;
  const valueWithoutExceptions = removeAllExceptions(value, exceptions);
  return valueWithoutExceptions.trim().length <= maxLength;
};

export const validateRequired: ValidateFunctionDefault = ({ value }) =>
  value.trim().length > 0;

type ValidateDependentFunction = ({
  value,
  dependentValue,
}: {
  value: string;
  dependentValue?: string;
}) => boolean;
export const validateRequiredIf: ValidateDependentFunction = ({
  value,
  dependentValue,
}) =>
  !dependentValue || validateRequired({ value: dependentValue })
    ? validateRequired({ value })
    : true;

type ValidateRequiredIfConditionFunction = ({
  value,
  condition,
  allData,
}: {
  value: string;
  condition: Condition;
  allData: GrundModel;
}) => boolean;
export const validateRequiredIfCondition: ValidateRequiredIfConditionFunction =
  ({ value, condition, allData }) =>
    condition(allData) ? validateRequired({ value }) : true;

export const validateForbiddenIf: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => !dependentValue || (dependentValue.trim() ? !value.trim() : true);

export const validateEitherOr: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => (dependentValue?.trim() ? !value.trim() : !!value.trim());

type ValidateYearAfterBaujahrFunction = ({
  value,
  allData,
}: {
  value: string;
  allData: GrundModel;
}) => boolean;
export const validateYearAfterBaujahr: ValidateYearAfterBaujahrFunction = ({
  value,
  allData,
}) => {
  const baujahr = allData.gebaeude?.baujahr?.baujahr;
  if (!value || !baujahr) return true;
  return +value >= +baujahr;
};

export const validateBiggerThan: ValidateDependentFunction = ({
  value,
  dependentValue,
}) => {
  return !value || !dependentValue || +value > +dependentValue;
};

export const validateHausnummer: ValidateFunctionDefault = ({ value }) => {
  if (!value) return true;
  if (value.length > 14) return false; // hausnummer + hausnummerzusatz
  if (!validator.isInt(value[0])) return false; // start with number
  // if value (minus first number) is too long to fit into hausnummerzusatz:
  // make sure it also starts with the correct count of numbers
  return !(
    value.length > 11 && !validator.isDecimal(value.slice(0, value.length - 10))
  );
};

export const validateGrundbuchblattnummer: ValidateFunctionDefault = ({
  value,
}) => {
  if (!value) return true;
  if (value.length > 6) return false;
  if (!validator.isInt(value[0])) return false; // start with number
  if (value.length > 1 && !validator.isInt(value.slice(0, value.length - 1)))
    return false; // only last char may not be number
  return true;
};

const isZeroOrEmpty = (value: string) => {
  return /^[0 ]*$/.test(value);
};

type ValidateFlurstueckGroesseFunction = ({
  valueHa,
  valueA,
  valueQm,
}: {
  valueHa: string;
  valueA: string;
  valueQm: string;
}) => boolean;
export const validateFlurstueckGroesse: ValidateFlurstueckGroesseFunction = ({
  valueHa,
  valueA,
  valueQm,
}) => {
  if (!isZeroOrEmpty(valueHa)) {
    return valueA.trim().length <= 2 && valueQm.trim().length <= 2;
  }
  if (!isZeroOrEmpty(valueA)) {
    return valueQm.trim().length <= 2;
  }
  return true;
};

export const validateFlurstueckGroesseLength: ValidateFlurstueckGroesseFunction =
  ({ valueHa, valueA, valueQm }) => {
    return (
      valueHa.trim().length + valueA.trim().length + valueQm.trim().length <= 15
    );
  };

export const validateFlurstueckGroesseRequired: ValidateFlurstueckGroesseFunction =
  ({ valueHa, valueA, valueQm }) => {
    return ![valueHa, valueA, valueQm].every((value) => isZeroOrEmpty(value));
  };

type ValidateMinValueFunction = ({
  value,
  minValue,
}: {
  value: string;
  minValue: number;
}) => boolean;
export const validateMinValue: ValidateMinValueFunction = ({
  value,
  minValue,
}) => !value || !validateOnlyDecimal({ value }) || +value >= minValue;

export const validateYearInFuture: ValidateFunctionDefault = ({ value }) => {
  if (!validateOnlyDecimal({ value })) return true;
  if (value.length != 4) return true;
  return (
    new Date(+value, 11, 31).getTime() >=
    new Date(Date.now()).setHours(0, 0, 0, 0)
  );
};

type ValidateYearInPast = ({
  value,
  excludingCurrentYear,
}: {
  value: string;
  excludingCurrentYear?: boolean;
}) => boolean;
export const validateYearInPast: ValidateYearInPast = ({
  value,
  excludingCurrentYear,
}) => {
  if (!validateOnlyDecimal({ value })) return true;
  if (value.length != 4) return true;

  if (excludingCurrentYear) {
    return +value < new Date(Date.now()).getFullYear();
  } else {
    return +value <= new Date(Date.now()).getFullYear();
  }
};

// Because of potentially different timezones, the current implementation
// cannot be reliably used if the input date is not at least 1 day in the past.
export const validateDateInPast: ValidateFunctionDefault = ({ value }) => {
  if (!value || !validateIsDate({ value })) return true;
  const splitDate = value.split(".");
  return (
    Date.UTC(+splitDate[2], +splitDate[1] - 1, +splitDate[0]) <= Date.now()
  );
};

interface DefaultValidation {
  msg?: string;
}

interface OnlyDecimalValidation extends DefaultValidation {
  exceptions?: string[];
}

interface MinLengthFloatValidation extends DefaultValidation {
  preComma: number;
  postComma: number;
}

interface MinLengthValidation extends DefaultValidation {
  minLength: number;
  exceptions?: string[];
}

interface MaxLengthValidation extends DefaultValidation {
  maxLength: number;
  exceptions?: string[];
}

interface MinValueValidation extends DefaultValidation {
  minValue: number;
}

interface YearInPastValidation extends DefaultValidation {
  excludingCurrentYear?: boolean;
}

interface DependentValidation extends DefaultValidation {
  dependentField: string;
}

interface RequiredIfConditionValidation extends DefaultValidation {
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

export type ValidationConfig = Record<string, Validation>;

export const getErrorMessage = (
  value: string,
  validationConfig: ValidationConfig,
  formData: StepFormData,
  allData: GrundModel,
  i18n: Record<string, Record<string, string> | string>
): string | undefined => {
  const validatorMapping: Record<string, ValidateFunction> = {
    required: validateRequired,
    requiredIf: validateRequiredIf,
    requiredIfCondition: validateRequiredIfCondition,
    email: validateEmail,
    onlyDecimal: validateOnlyDecimal,
    isDate: validateIsDate,
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
      })
    ) {
      return validation.msg || (i18n[key] as string);
    }
  }
};

export const validateStepFormData = async (
  currentStateWithoutId: string,
  stepFormData: StepFormData,
  storedFormData: GrundModel
): Promise<Record<string, string>> => {
  const errors: Record<string, string> = {};
  const stepDefinition = getStepDefinition({ currentStateWithoutId });
  const tFunction = await i18Next.getFixedT("de", "all");
  if (stepDefinition) {
    Object.entries(stepDefinition.fields).forEach(
      ([name, field]: [
        string,
        StepDefinitionField | StepDefinitionFieldWithOptions
      ]) => {
        let value = stepFormData[name];
        // unchecked checkbox
        if (typeof value == "undefined") {
          value = "";
        }

        const i18n = { ...(tFunction("errors") as object) };
        const errorMessage = getErrorMessage(
          value,
          field.validations,
          stepFormData,
          storedFormData,
          i18n
        );
        if (errorMessage) errors[name] = errorMessage;
      }
    );
  }
  return errors;
};

export const validateAllStepsData = async (
  storedFormData: GrundModel
): Promise<GeneralErrors> => {
  const generalErrors = {};
  const reachablePaths = getReachablePathsFromData(storedFormData);
  for (const stepPath of reachablePaths) {
    const stepFormData = getStepData(storedFormData, stepPath);
    const stepDefinition = _.get(
      stepDefinitions,
      getCurrentStateWithoutId(stepPath)
    );
    if (!stepDefinition) continue; // no validations necessary

    let fieldErrors: Record<string, string | undefined> = {};
    if (stepFormData) {
      fieldErrors = await validateStepFormData(
        stepPath,
        stepFormData,
        storedFormData
      );
    } else {
      Object.keys(stepDefinition.fields).forEach(
        (field) => (fieldErrors[field] = "Bitte ergänzen")
      );
    }
    if (Object.keys(fieldErrors).length !== 0)
      _.set(generalErrors, idToIndex(stepPath), fieldErrors);
  }
  return generalErrors;
};
