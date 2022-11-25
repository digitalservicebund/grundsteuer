import { StepComponentFunction } from "~/routes/__infoLayout/pruefen/_step";
import IntroText from "../IntroText";
import { Trans } from "react-i18next";
import failureImage from "~/assets/images/pruefen-no.svg";
import { I18nObject } from "~/i18n/getStepI18n";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { PruefenModel } from "~/domain/pruefen/model";

const getFailureReason = (allData: PruefenModel, i18n: I18nObject) => {
  if (!pruefenConditions.isEigentuemer(allData))
    return i18n.specifics.noEigentuemer;
  if (!pruefenConditions.isPrivatperson(allData))
    return i18n.specifics.noPrivatperson;
  if (!pruefenConditions.isBundesmodelBundesland(allData))
    return i18n.specifics.invalidBundesland;
  if (!pruefenConditions.isEligibleGrundstueckArt(allData))
    return i18n.specifics.invalidGrundstueckArt;
  if (!pruefenConditions.isNotAusland(allData)) return i18n.specifics.ausland;
  if (!pruefenConditions.isNotFremderBoden(allData))
    return i18n.specifics.fremderBoden;
  if (!pruefenConditions.isNotBeguenstigung(allData))
    return i18n.specifics.beguenstigung;
  return i18n.specifics.explanationFallback;
};

const KeineNutzung: StepComponentFunction = ({ i18n, allData }) => {
  const reason = getFailureReason(allData, i18n);
  return (
    <div>
      <IntroText className="mb-32">
        <Trans
          components={{
            elsterLink: (
              <a
                href="https://www.elster.de/eportal/start"
                className="underline font-bold"
                target="_blank"
              />
            ),
            break: <br />,
          }}
        >
          {reason}
        </Trans>
      </IntroText>
      <img src={failureImage} alt="" className="mb-80 mx-auto" />
    </div>
  );
};

export default KeineNutzung;
