import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {};
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Vielen Dank</Headline>

        <IntroText>
          Sie haben Ihren persönlichen Freischaltcode beantragt. Diesen erhalten
          Sie in den nächsten 14 Tagen per Post. Sie können jetzt die
          Feststellungserklärung ausfüllen und zu einem späteren Zeitpunkt den
          Freischaltcode eingeben.
        </IntroText>

        <IntroText className="mb-80">
          Es könnte sein, dass in der Zwischenzeit dennoch Ihr Brief mit dem
          zuvor beantragten Freischaltcode zugestellt wird. In diesem Fall ist
          der alte Freischaltcode ungültig. Warten Sie auf den neuen Brief um
          den Freischaltcode einzugeben.
        </IntroText>

        <Button to="/formular">Weiter zum Formular</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
