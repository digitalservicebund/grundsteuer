import { HelpComponentFunction } from "~/routes/formular/_step";
import steuernummerGrundbuch from "~/assets/images/steuernummer-grundbuch-small.png";
import steuernummerGrundbuchMedium from "~/assets/images/steuernummer-grundbuch-medium.png";
import { useTranslation } from "react-i18next";
import { ImageLightbox } from "~/components/ImageLightbox";

export const SteuernummerHelp: HelpComponentFunction = ({ i18n }) => {
  const { t } = useTranslation("all");
  return (
    <>
      <h2 className="font-bold mb-8">{i18n.help.heading}</h2>
      <p className="mb-8">{i18n.help.paragraph}</p>
      <ImageLightbox
        thumbnail={steuernummerGrundbuch}
        image={steuernummerGrundbuchMedium}
        altText={t("alt.steuernummerGrundbuch")}
      />
    </>
  );
};
