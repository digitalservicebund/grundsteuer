import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  SuccessPageLayout,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator, SessionUser } from "~/auth.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich angemeldet.") };
};

const getNextStepUrl = (user: SessionUser) => {
  if (!user.inDeclarationProcess) return "/formular/erfolg";
  if (!user.identified) return "/identifikation";
  return "/formular";
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  return {
    nextStepUrl: getNextStepUrl(user),
  };
};
export default function ErfolgreichAngemeldet() {
  const { nextStepUrl } = useLoaderData();

  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout>
          <Headline> Sie haben sich erfolgreich angemeldet. </Headline>
          <IntroText>
            Sie können die Bearbeitung jederzeit unterbrechen und fortführen.
          </IntroText>

          <IntroText className="mb-80">
            Bitte beachten Sie, das dies nur am Gerät und Browser möglich ist,
            in dem Sie sich registriert haben.
          </IntroText>

          <Button data-testid="continue" to={nextStepUrl}>
            Verstanden & weiter
          </Button>
        </SuccessPageLayout>
      </ContentContainer>
    </UserLayout>
  );
}
