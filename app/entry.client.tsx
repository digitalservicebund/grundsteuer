import i18next from "i18next";
import { hydrate } from "react-dom";
import { initReactI18next } from "react-i18next";
import { RemixBrowser } from "remix";
import { RemixI18NextProvider } from "remix-i18next";

i18next
  .use(initReactI18next)
  .init({
    supportedLngs: ["de"],
    defaultNS: "common",
    fallbackLng: "de",
    react: { useSuspense: false },
  })
  .then(() => {
    return hydrate(
      <RemixI18NextProvider i18n={i18next}>
        <RemixBrowser />
      </RemixI18NextProvider>,
      document
    );
  });
