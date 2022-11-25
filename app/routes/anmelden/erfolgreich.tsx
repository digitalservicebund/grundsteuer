import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
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
import { flags } from "~/flags.server";
import { rememberCookie } from "~/rememberLogin.server";

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

  // save the "remember login" cookie
  const URL_PARAM_NAME_WHEN_COOKIE_IS_SET = "r";
  const currentUrl = new URL(request.url);
  const cookieIsSet = currentUrl.searchParams.get(
    URL_PARAM_NAME_WHEN_COOKIE_IS_SET
  );

  if (!cookieIsSet) {
    const redirectUrl = `${currentUrl.pathname}?${URL_PARAM_NAME_WHEN_COOKIE_IS_SET}=1`;
    return redirect(redirectUrl, {
      headers: { "Set-Cookie": await rememberCookie() },
    });
  }

  return {
    email: user.email,
    nextStepUrl: getNextStepUrl(user),
    flags: flags.getAllFlags(),
  };
};
export default function ErfolgreichAngemeldet() {
  const { email, nextStepUrl, flags } = useLoaderData();

  return (
    <UserLayout email={email} flags={flags}>
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
