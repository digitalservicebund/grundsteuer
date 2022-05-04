import { MetaFunction } from "@remix-run/node";
import { Button, ContentContainer, IntroText } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <IntroText className="mb-80">
        Ihr Freischaltcode wurde erfolgreich gespeichert. Sie können Ihre
        Grundsteuererklärung ab jetzt jederzeit an Ihr Finanzamt übermitteln.
      </IntroText>

      <Button to="/formular/welcome">Zur Grundsteuererklärung</Button>
    </ContentContainer>
  );
}
