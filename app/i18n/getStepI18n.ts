import { i18Next } from "~/i18n.server";
import { TFunction } from "i18next";
import _ from "lodash";

export type I18nObjectField = {
  label: string;
  options?: {
    [index: string]: {
      label: string;
      help?: string;
      description?: string;
    };
  };
  placeholder?: string;
  help?: string;
};

export type I18nObject = {
  headline: string;
  headlineWeitereErklaerung?: string;
  alternativeHeadline?: string;
  alternativeDescription?: string;
  headlineOld?: string;
  description?: string;
  hint?: string;
  fields: {
    [index: string]: I18nObjectField;
  };
  specifics: Record<string, string>;
  help?: Record<string, string>;
  nextButtonLabel: string;
  common: Record<string, string>;
};

const getStepSpecificI18n = (
  tFunction: TFunction,
  stepI18nKey: string,
  stepI18nParams?: { id?: string },
  bundesland = "default",
  prefix = ""
) => {
  if (
    [
      "grundstueck.bodenrichtwertInfo",
      "grundstueck.bodenrichtwertAnzahl",
      "grundstueck.bodenrichtwertEingabe",
      "grundstueck.steuernummer",
      "grundstueck.miteigentumWohnung",
      "grundstueck.miteigentumGarage",
      "grundstueck.flurstueck.angaben",
    ].includes(stepI18nKey)
  ) {
    return getBundeslandTranslations(
      stepI18nKey,
      tFunction,
      bundesland,
      stepI18nParams
    );
  } else {
    const key = prefix ? prefix + "." + stepI18nKey : stepI18nKey;
    return {
      ...(tFunction(key, stepI18nParams) as object),
    };
  }
};

const getBundeslandTranslations = (
  stepI18nKey: string,
  tFunction: TFunction,
  bundesland: string,
  stepI18nParams?: { id?: string }
) => {
  const defaultKey = `${stepI18nKey}.default`;
  const defaultTranslations = tFunction(defaultKey, stepI18nParams) as object;

  if (bundesland === "default") {
    return { ...defaultTranslations };
  } else {
    const bundeslandKey = `${stepI18nKey}.${bundesland.toLowerCase()}`;
    let bundeslandTranslations = tFunction(
      bundeslandKey,
      stepI18nParams
    ) as object;

    // if no specific bundesland key is defined to override default, we do not want the fallback value
    // from tFunction (which is equal to the key itself, e.g. grundstueck.steuernummer.bb) to be merged
    if (bundeslandKey === bundeslandTranslations.toString()) {
      bundeslandTranslations = {};
    }
    return _.merge({ ...defaultTranslations }, { ...bundeslandTranslations });
  }
};

export const getStepI18n = async (
  stepI18nKey: string,
  stepI18nParams?: { id?: string },
  bundesland = "default",
  prefix = ""
) => {
  const tFunction = await i18Next.getFixedT("de", "all");
  const stepTranslations = getStepSpecificI18n(
    tFunction,
    stepI18nKey,
    stepI18nParams,
    bundesland,
    prefix
  );
  return {
    ...stepTranslations,
    common: { ...tFunction("common") },
  } as I18nObject;
};
