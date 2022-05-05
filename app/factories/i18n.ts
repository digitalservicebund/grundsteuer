import { i18Next } from "~/i18n.server";
import { I18nObject } from "~/i18n/getStepI18n";

export async function getI18nObject(
  path: string,
  id?: string
): Promise<I18nObject> {
  const tFunction = await i18Next.getFixedT("de", "all");
  const inter = {
    ...(tFunction(path, {
      id: id,
    }) as object),
    common: { ...(tFunction("common") as object) },
  };
  return inter as I18nObject;
}
