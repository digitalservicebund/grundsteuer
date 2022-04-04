import invariant from "tiny-invariant";
import { StepFormData } from "~/domain/model";
import validator from "validator";
import { Condition } from "~/domain/guards";
import { GrundModel } from "~/domain/steps";

type ValidateFunctionDefault = (value: string) => boolean;

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

export const validateElsterChars: ValidateFunctionDefault = (value) =>
  Array.from(value).every((char) => SUPPORTED_CHARS.includes(char));

export const validateEmail: ValidateFunctionDefault = (value) =>
  validator.isEmail(value);

export const validateOnlyDecimal: ValidateFunctionDefault = (value) =>
  !value ||
  (validator.isInt(value.trim(), { allow_leading_zeroes: true }) &&
    +value >= 0);

export const validateIsDate: ValidateFunctionDefault = (value) =>
  !value ||
  validator.isDate(value.trim(), {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });

export const validateNoZero: ValidateFunctionDefault = (value) => value != "0";

export const validateFloat: ValidateFunctionDefault = (value) =>
  !value || validator.isFloat(value.trim(), { locale: "de-DE" });

type ValidateMaxLengthFloatFunction = (
  value: string,
  preComma: number,
  postComma: number
) => boolean;
export const validateMaxLengthFloat: ValidateMaxLengthFloatFunction = (
  value,
  preComma,
  postComma
) => {
  if (!value) return true;
  const split_values = value.trim().split(",");
  return (
    split_values[0].length <= preComma &&
    (!split_values[1] || split_values[1].length <= postComma)
  );
};
type ValidateMinLengthFunction = (value: string, minLength: number) => boolean;
export const validateMinLength: ValidateMinLengthFunction = (
  value,
  minLength
) => {
  if (!value) return true;
  return value.trim().length >= minLength;
};

type ValidateMaxLengthFunction = (value: string, maxLength: number) => boolean;
export const validateMaxLength: ValidateMaxLengthFunction = (
  value,
  maxLength
) => value.trim().length <= maxLength;

export const validateRequired: ValidateFunctionDefault = (value) =>
  value.trim().length > 0;

type ValidateDependentFunction = (
  value: string,
  dependentValue: string
) => boolean;
export const validateRequiredIf: ValidateDependentFunction = (
  value,
  dependentValue
) => (validateRequired(dependentValue) ? validateRequired(value) : true);

type ValidateRequiredIfCondition = (
  value: string,
  condition: Condition,
  allData: GrundModel
) => boolean;
export const validateRequiredIfCondition: ValidateRequiredIfCondition = (
  value,
  condition,
  allData
) => (condition(allData) ? validateRequired(value) : true);

export const validateForbiddenIf: ValidateDependentFunction = (
  value,
  dependentValue
) => (dependentValue.trim() ? !value.trim() : true);

export const validateEitherOr: ValidateDependentFunction = (
  value,
  dependentValue
) => (dependentValue.trim() ? !value.trim() : !!value.trim());

type ValidateYearAfterBaujahr = (value: string, allData: GrundModel) => boolean;
export const validateYearAfterBaujahr: ValidateYearAfterBaujahr = (
  value,
  allData
) => {
  const baujahr = allData.gebaeude?.baujahr?.baujahr;
  if (!value || !baujahr) return true;
  return +value >= +baujahr;
};

export const validateBiggerThan: ValidateDependentFunction = (
  value,
  dependentValue
) => {
  return !value || !dependentValue || +value > +dependentValue;
};

export const validateHausnummer: ValidateFunctionDefault = (value) => {
  if (!value) return true;
  if (value.length > 14) return false; // hausnummer + hausnummerzusatz
  if (!validator.isInt(value[0])) return false; // start with number
  // if value (minus first number) is too long to fit into hausnummerzusatz:
  // make sure it also starts with the correct count of numbers
  return !(
    value.length > 11 && !validator.isDecimal(value.slice(0, value.length - 10))
  );
};

export const validateGrundbuchblattnummer: ValidateFunctionDefault = (
  value
) => {
  if (!value) return true;
  if (value.length > 6) return false;
  if (!validator.isInt(value[0])) return false; // start with number
  if (value.length > 1 && !validator.isInt(value.slice(0, value.length - 1)))
    return false; // only last char may not be number
  return true;
};

type ValidateMinValueFunction = (value: string, minValue: number) => boolean;
export const validateMinValue: ValidateMinValueFunction = (value, minValue) =>
  !value || !validateOnlyDecimal(value) || +value >= minValue;

export const validateYearInFuture: ValidateFunctionDefault = (value) => {
  if (!validateOnlyDecimal(value)) return true;
  if (value.length != 4) return true;
  return (
    new Date(+value, 11, 31).getTime() >=
    new Date(Date.now()).setHours(0, 0, 0, 0)
  );
};

type ValidateYearInPast = (
  value: string,
  excludingCurrentYear?: boolean
) => boolean;
export const validateYearInPast: ValidateYearInPast = (
  value,
  excludingCurrentYear
) => {
  if (!validateOnlyDecimal(value)) return true;
  if (value.length != 4) return true;

  if (excludingCurrentYear) {
    return +value < new Date(Date.now()).getFullYear();
  } else {
    return +value <= new Date(Date.now()).getFullYear();
  }
};

export const validateDateInPast: ValidateFunctionDefault = (value) => {
  if (!value || !validateIsDate(value)) return true;
  const splitDate = value.split(".");
  return (
    Date.UTC(+splitDate[2], +splitDate[1] - 1, +splitDate[0]) <= Date.now()
  );
};

interface DefaultValidation {
  msg: string;
}

interface MinLengthFloatValidation extends DefaultValidation {
  preComma: number;
  postComma: number;
}

interface MinLengthValidation extends DefaultValidation {
  minLength: number;
}

interface MaxLengthValidation extends DefaultValidation {
  maxLength: number;
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
  | RequiredIfConditionValidation
  | MaxLengthValidation
  | MinLengthValidation;

type ValidationConfig = Record<string, Validation>;

export const getErrorMessage = (
  value: string,
  validationConfig: ValidationConfig,
  formData: StepFormData,
  allData: GrundModel,
  i18n: Record<string, Record<string, string> | string>
): string | undefined => {
  const {
    email,
    onlyDecimal,
    isDate,
    noZero,
    float,
    maxLengthFloat,
    maxLength,
    minLength,
    minValue,
    required,
    requiredIf,
    requiredIfCondition,
    forbiddenIf,
    eitherOr,
    yearAfterBaujahr,
    biggerThan,
    hausnummer,
    grundbuchblattnummer,
    yearInFuture,
    yearInPast,
    dateInPast,
  } = validationConfig;

  if (!validateElsterChars(value)) {
    return i18n.elsterChars as string;
  }

  if (required && !validateRequired(value)) {
    return required.msg || (i18n.required as string);
  }

  if (requiredIf) {
    const dependentValue =
      formData[(requiredIf as DependentValidation).dependentField];
    invariant(typeof dependentValue === "string");
    if (!validateRequiredIf(value, dependentValue)) {
      return requiredIf.msg;
    }
  }

  if (
    requiredIfCondition &&
    !validateRequiredIfCondition(
      value,
      (requiredIfCondition as RequiredIfConditionValidation).condition,
      allData
    )
  ) {
    return requiredIfCondition.msg;
  }

  if (forbiddenIf) {
    const dependentValue =
      formData[(forbiddenIf as DependentValidation).dependentField];
    invariant(typeof dependentValue === "string");
    if (!validateForbiddenIf(value, dependentValue)) {
      return forbiddenIf.msg;
    }
  }

  if (eitherOr) {
    const dependentValue =
      formData[(eitherOr as DependentValidation).dependentField];
    invariant(typeof dependentValue === "string");
    if (!validateEitherOr(value, dependentValue)) {
      return eitherOr.msg;
    }
  }

  if (yearAfterBaujahr && !validateYearAfterBaujahr(value, allData)) {
    return yearAfterBaujahr.msg || (i18n.yearAfterBaujahr as string);
  }

  if (biggerThan) {
    const dependentValue =
      formData[(biggerThan as DependentValidation).dependentField];
    invariant(typeof dependentValue === "string");
    if (!validateBiggerThan(value, dependentValue)) {
      return biggerThan.msg;
    }
  }

  if (hausnummer && !validateHausnummer(value)) {
    return hausnummer.msg || (i18n.hausnummer as string);
  }

  if (grundbuchblattnummer && !validateGrundbuchblattnummer(value)) {
    return grundbuchblattnummer.msg || (i18n.grundbuchblattnummer as string);
  }

  if (email && !validateEmail(value)) {
    return email.msg;
  }

  if (onlyDecimal && !validateOnlyDecimal(value)) {
    return onlyDecimal.msg || (i18n.onlyDecimal as string);
  }

  if (isDate && !validateIsDate(value)) {
    return isDate.msg || (i18n.isDate as string);
  }

  if (noZero && !validateNoZero(value)) {
    return noZero.msg || (i18n.noZero as string);
  }

  if (float && !validateFloat(value)) {
    return float.msg || (i18n.float as string);
  }

  if (
    maxLengthFloat &&
    !validateMaxLengthFloat(
      value,
      (maxLengthFloat as MinLengthFloatValidation).preComma,
      (maxLengthFloat as MinLengthFloatValidation).postComma
    )
  ) {
    return maxLengthFloat.msg;
  }

  if (
    minLength &&
    !validateMinLength(value, (minLength as MinLengthValidation).minLength)
  ) {
    return minLength.msg;
  }

  if (
    maxLength &&
    !validateMaxLength(value, (maxLength as MaxLengthValidation).maxLength)
  ) {
    return maxLength.msg;
  }

  if (
    minValue &&
    !validateMinValue(value, (minValue as MinValueValidation).minValue)
  ) {
    return minValue.msg;
  }

  if (yearInFuture && !validateYearInFuture(value)) {
    return yearInFuture.msg || (i18n.yearInFuture as string);
  }

  if (
    yearInPast &&
    !validateYearInPast(
      value,
      (yearInPast as YearInPastValidation).excludingCurrentYear
    )
  ) {
    return yearInPast.msg || (i18n.yearInPast as string);
  }

  if (dateInPast && !validateDateInPast(value)) {
    return dateInPast.msg || (i18n.dateInPast as string);
  }
};
