import { MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import UebersichtStep from "~/components/form/UebersichtStep";
import erfolgImageSmall from "~/assets/images/erfolg-small.svg";
import erfolgImageMedium from "~/assets/images/erfolg-medium.svg";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <UebersichtStep
        imageSrc={erfolgImageMedium}
        smallImageSrc={erfolgImageSmall}
      >
        <Headline>Vielen Dank</Headline>

        <IntroText className="mb-80">
          Sie haben ein Konto erstellt und Ihren persönlichen Freischaltcode
          beantragt. Diesen erhalten Sie in den nächsten 14 Tagen per Post.
        </IntroText>

        <Button to="/formular/welcome">Weiter zum Formular</Button>
      </UebersichtStep>
    </ContentContainer>
  );
}
