import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  UebersichtStep,
} from "~/components/index";
import imageSrc from "~/assets/images/identified-medium.svg";
import smallImageSrc from "~/assets/images/identified-small.svg";

type BackButton = "start" | "summary";

type IdentificationSuccessProps = {
  backButton: BackButton;
};

const renderBackButton = (backButton: BackButton) => {
  if (backButton === "summary")
    return <Button to="/formular/zusammenfassung">Zur Übersicht</Button>;
  return <Button to="/formular">Weiter zum Formular</Button>;
};

export default function IdentificationSuccess(
  props: IdentificationSuccessProps
) {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <UebersichtStep imageSrc={imageSrc} smallImageSrc={smallImageSrc}>
        <Headline>Sie haben sich erfolgreich identifiziert.</Headline>

        <IntroText className="mb-80">
          <p className="mb-24">
            Damit konnte sichergestellt werden, das Sie die Person sind, die die
            Grundsteuererklärung übermittelt. Sie können die vollständige
            Erklärung nun jederzeit absenden.
          </p>
          <p>Hinweis:</p>
          <ul className="ml-32 list-disc">
            <li className="mb-16">
              Die Identifikation findet nur einmal statt. Sie brauchen sich
              nicht für die Abgabe einer weiteren Erklärung neu identifizieren.
            </li>
            <li>
              Eine parallele Bearbeitung von mehreren Erklärungen ist nicht
              möglich. Sie geben die Erklärungen nacheinander ab.
            </li>
          </ul>
        </IntroText>
        {renderBackButton(props.backButton)}
      </UebersichtStep>
    </ContentContainer>
  );
}
