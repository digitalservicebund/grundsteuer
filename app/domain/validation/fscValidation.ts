import { i18Next } from "~/i18n.server";
import { ValidateFunctionDefault } from "~/domain/validation/ValidateFunction";
import { getErrorMessage } from "~/domain/validation/getErrorMessage";

export const validateFreischaltCode: ValidateFunctionDefault = ({ value }) =>
  /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(value);

export const getErrorMessageForSteuerId = async (steuerId: string) => {
  const tFunction = await i18Next.getFixedT("de", "all");
  const i18n: Record<string, Record<string, string> | string> = {
    ...tFunction("errors"),
  };
  return getErrorMessage(
    steuerId,
    {
      required: {},
      maxLength: {
        maxLength: 11,
        msg: (i18n["steuerId"] as Record<string, string>)["wrongLength"],
      },
      minLength: {
        minLength: 11,
        msg: (i18n["steuerId"] as Record<string, string>)["wrongLength"],
      },
      onlyDecimal: {
        msg: (i18n["steuerId"] as Record<string, string>)["onlyNumbers"],
      },
      isSteuerId: {},
    },
    {},
    {},
    i18n
  );
};

export const getErrorMessageForFreischaltcode = async (
  freischaltCode: string
) => {
  const tFunction = await i18Next.getFixedT("de", "all");
  const i18n: Record<string, Record<string, string> | string> = {
    ...tFunction("errors"),
  };
  return getErrorMessage(
    freischaltCode,
    {
      required: {},
      isFreischaltCode: {},
    },
    {},
    {},
    i18n
  );
};

export const getErrorMessageForGeburtsdatum = async (geburtsdatum: string) => {
  const tFunction = await i18Next.getFixedT("de", "all");
  const i18n: Record<string, Record<string, string> | string> = {
    ...tFunction("errors"),
  };
  return getErrorMessage(
    geburtsdatum,
    {
      required: {},
      isDate: {
        msg: (i18n["geburtsdatum"] as Record<string, string>)["wrongFormat"],
      },
      dateInPast: {
        msg: (i18n["geburtsdatum"] as Record<string, string>)["notInPast"],
      },
    },
    {},
    {},
    i18n
  );
};
