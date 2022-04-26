import { i18Next } from "~/i18n.server";

export type I18nObjectField = {
  label: string;
  options?: {
    [index: string]: {
      label: string;
      help?: string;
    };
  };
  placeholder?: string;
  help?: string;
};

export type I18nObject = {
  headline: string;
  headlineHelp?: string;
  fields: {
    [index: string]: I18nObjectField;
  };
  specifics: Record<string, string>;
  help: Record<string, string>;
  nextButtonLabel: string;
  common: Record<string, string>;
};

export const getStepI18n = async (
  stepI18nKey: string,
  stepI18nParams?: { id?: string },
  bundesland = "default"
) => {
  const tFunction = await i18Next.getFixedT("de", "all");
  if (stepI18nKey.startsWith("grundstueck.bodenrichtwert")) {
    const bundeslandKey = `${stepI18nKey}.${bundesland.toLowerCase()}`;
    return {
      ...tFunction(bundeslandKey, stepI18nParams),
      common: { ...tFunction("common"), ...tFunction(`${stepI18nKey}.common`) },
    } as I18nObject;
  } else {
    return {
      ...tFunction(stepI18nKey, stepI18nParams),
      common: { ...tFunction("common") },
    } as I18nObject;
  }
};
