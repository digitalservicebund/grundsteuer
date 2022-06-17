import { MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Ihr Freischaltcode wurde erfolgreich gespeichert.</Headline>
        <IntroText className="mb-80">
          Sie können Ihre Grundsteuererklärung ab jetzt jederzeit an Ihr
          Finanzamt übermitteln.
        </IntroText>

        <Button to="/formular/welcome">Zur Grundsteuererklärung</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
