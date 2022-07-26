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
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
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
        <Headline>Ihr Freischaltcode wurde erfolgreich gespeichert.</Headline>
        <IntroText className="mb-80">
          Sie können Ihre Grundsteuererklärung ab jetzt jederzeit an Ihr
          Finanzamt übermitteln.
        </IntroText>

        <Button to="/formular/zusammenfassung">Zur Übersicht</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
