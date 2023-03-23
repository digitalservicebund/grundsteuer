import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  UebersichtStep,
} from "~/components/index";
import imageSrc from "~/assets/images/identified-medium.svg";
import smallImageSrc from "~/assets/images/identified-small.svg";
import { ReactNode } from "react";

type BackButton = "start" | "summary";

type IdentificationSuccessProps = {
  backButton: BackButton;
  children?: ReactNode;
  identificationType?: string;
  hasSurveyShown?: boolean;
};

const renderAdditionalHint = (identificationType?: string) => {
  if (identificationType === "bundesIdent") {
    return (
      <li>
        Falls Sie die Grundsteuererklärung auf dem Computer angefangen haben,
        können Sie jetzt zurückkehren. Klicken Sie am Computer auf
        »Identifikation abgeschlossen & Seite neu laden«.
      </li>
    );
  }
};

const renderContinueButton = (
  backButton: BackButton,
  hasSurveyShown?: boolean,
  identificationType?: string
) => {
  const classes = "mt-80";
  const isBundesIdentIdentification = identificationType === "bundesIdent";

  if (backButton === "summary")
    return (
      <Button to="/formular/zusammenfassung" className={classes}>
        Zur Übersicht
      </Button>
    );
  return (
    <Button
      to={
        !hasSurveyShown && isBundesIdentIdentification
          ? "/bundesIdent/survey/success"
          : "/formular"
      }
      className={classes}
    >
      Weiter zum Formular
    </Button>
  );
};

export default function IdentificationSuccess(
  props: IdentificationSuccessProps
) {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <UebersichtStep imageSrc={imageSrc} smallImageSrc={smallImageSrc}>
        <Headline>Sie haben sich erfolgreich identifiziert.</Headline>

        <div className="text-18 leading-26">
          <p className="mb-24">
            Damit konnte sichergestellt werden, dass Sie die Person sind, die
            die Grundsteuererklärung übermittelt. Sie können die vollständige
            Erklärung nun jederzeit absenden.
          </p>
          <p>Hinweis:</p>
          <ul className="ml-32 list-disc">
            <li className="mb-16">
              Die Identifikation findet nur einmal statt. Sie brauchen sich
              nicht für die Abgabe einer weiteren Erklärung neu identifizieren.
            </li>
            <li className="mb-16">
              Eine parallele Bearbeitung von mehreren Erklärungen ist nicht
              möglich. Sie geben die Erklärungen nacheinander ab.
            </li>
            {renderAdditionalHint(props.identificationType)}
          </ul>
        </div>
        {props.children}
        {renderContinueButton(
          props.backButton,
          props.hasSurveyShown,
          props.identificationType
        )}
      </UebersichtStep>
    </ContentContainer>
  );
}
