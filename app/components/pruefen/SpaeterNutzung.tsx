import { StepComponentFunction } from "~/routes/pruefen/_step";
import IntroText from "../IntroText";
import maybeImage from "~/assets/images/pruefen-maybe.svg";
import { Trans } from "react-i18next";

const SpaeterNutzung: StepComponentFunction = ({ i18n }) => {
  return (
    <div>
      <IntroText className="mb-8">{i18n.specifics.explanation1}</IntroText>
      <IntroText className="mb-80">
        <Trans
          components={{
            emailContactLink: (
              <a
                className="text-blue-900 underline font-bold"
                href="mailto:kontakt@grundsteuererklaerung-fuer-privateigentum.de?subject=Benachrichtigung%20bei%20erlaubtem%20Elsterkonto"
              />
            ),
          }}
        >
          {i18n.specifics.explanation2}
        </Trans>
      </IntroText>
      <img src={maybeImage} alt="" className="mb-80 mx-auto" />
    </div>
  );
};

export default SpaeterNutzung;
