import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import { HelpComponentFunction } from "~/routes/formular/_step";
import angabenGrundbuchTitle from "~/assets/images/angaben-grundbuch-title-small.png";
import angabenGrundbuchTitleMedium from "~/assets/images/angaben-grundbuch-title-medium.png";
import angabenGrundbuchPage from "~/assets/images/angaben-grundbuch-page-small.png";
import angabenGrundbuchPageMedium from "~/assets/images/angaben-grundbuch-page-medium.png";
import { useTranslation } from "react-i18next";
import { ImageLightbox } from "~/components/ImageLightbox";

const FlurstueckAngaben: StepComponentFunction = (props) => {
  return (
    <div>
      <StepFormFields {...props} />
    </div>
  );
};

export default FlurstueckAngaben;

export const GrundstueckFlurstueckAngabenHelp: HelpComponentFunction = ({
  i18n,
}) => {
  const { t } = useTranslation("all");
  return (
    <>
      <p className="mb-8">{i18n.help.paragraph1}</p>
      <p className="mb-8">{i18n.help.paragraph2}</p>
      <div className="mb-8">
        <ImageLightbox
          thumbnail={angabenGrundbuchTitle}
          image={angabenGrundbuchTitleMedium}
          altText={t("alt.angabenGrundbuchTitle")}
        />
      </div>
      <ImageLightbox
        thumbnail={angabenGrundbuchPage}
        image={angabenGrundbuchPageMedium}
        altText={t("alt.angabenGrundbuchPage")}
      />
    </>
  );
};
