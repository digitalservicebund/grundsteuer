import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import { HelpComponentFunction } from "~/routes/formular/_step";
import angabenGrundbuchTitle from "~/assets/images/angaben-grundbuch-title-small.png";
import angabenGrundbuchPage from "~/assets/images/angaben-grundbuch-page-small.png";
import { useTranslation } from "react-i18next";

const GrundstueckFlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  currentState,
}) => {
  return (
    <div>
      <StepFormFields {...{ stepDefinition, formData, i18n, currentState }} />
    </div>
  );
};

export default GrundstueckFlurstueckAngaben;

export const GrundstueckFlurstueckAngabenHelp: HelpComponentFunction = ({
  i18n,
}) => {
  const { t } = useTranslation("all");
  return (
    <>
      <p className="mb-8">{i18n.help.paragraph1}</p>
      <p className="mb-8">{i18n.help.paragraph2}</p>
      <img
        src={angabenGrundbuchTitle}
        alt={t("alt.angabenGrundbuchTitle")}
        className="w-full mb-8"
      />
      <img
        src={angabenGrundbuchPage}
        alt={t("alt.angabenGrundbuchPage")}
        className="w-full"
      />
    </>
  );
};
