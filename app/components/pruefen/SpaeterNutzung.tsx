import { StepComponentFunction } from "~/routes/pruefen/_step";
import IntroText from "../IntroText";
import maybeImage from "~/assets/images/pruefen-maybe.svg";
import { Trans } from "react-i18next";
import { PruefenModel } from "~/domain/pruefen/model";
import { I18nObject } from "~/i18n/getStepI18n";
import { pruefenConditions } from "~/domain/pruefen/guards";

const getSpaeterReason = (allData: PruefenModel, i18n: I18nObject) => {
  if (!pruefenConditions.isEligibleGarage(allData))
    return {
      reasonParagraph1: i18n.specifics.garagenParagraph1,
      reasonParagraph2: i18n.specifics.garagenParagraph2,
      emailSubject: i18n.specifics.garagenEmailSubject,
    };
  return { reasonParagraph1: i18n.specifics.explanationFallback };
};

const SpaeterNutzung: StepComponentFunction = ({ i18n, allData }) => {
  const { reasonParagraph1, reasonParagraph2, emailSubject } = getSpaeterReason(
    allData,
    i18n
  );
  return (
    <div>
      <IntroText className="mb-8">{reasonParagraph1}</IntroText>
      <IntroText className="mb-80">
        <Trans
          components={{
            emailContactLink: (
              <a
                className="text-blue-900 underline font-bold"
                href={`mailto:erinnerung@grundsteuererklaerung-fuer-privateigentum.de?subject=${
                  emailSubject?.split(" ").join("%20") || ""
                }`}
              />
            ),
          }}
        >
          {reasonParagraph2 || ""}
        </Trans>
      </IntroText>
      <img src={maybeImage} alt="" className="mb-80 mx-auto" />
    </div>
  );
};

export default SpaeterNutzung;
