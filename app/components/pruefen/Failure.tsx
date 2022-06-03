import { StepComponentFunction } from "~/routes/formular/_step";
import IntroText from "../IntroText";
import { Trans } from "react-i18next";
import failureImage from "~/assets/images/pruefen-no.svg";

const Failure: StepComponentFunction = ({ i18n }) => {
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
          }}
        >
          {i18n.specifics.explanation}
        </Trans>
      </IntroText>
      <img src={failureImage} alt="" className="mb-80" />
    </div>
  );
};

export default Failure;
