import { MetaFunction } from "@remix-run/node";
import { Button, ContentContainer, Headline, IntroText } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <Headline>Vielen Dank</Headline>

      <IntroText className="mb-80">
        Sie haben ein Konto erstellt und Ihren persönlichen Freischaltcode
        beantragt. Diesen erhalten Sie in den nächsten 14 Tagen per Post.
      </IntroText>

      <Button to="/formular/welcome">Weiter zum Formular</Button>
    </ContentContainer>
  );
}
