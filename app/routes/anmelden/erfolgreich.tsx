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
import { authenticator } from "~/auth.server";
import { useLoaderData, useLocation } from "@remix-run/react";
import { flags } from "~/flags.server";
import { rememberCookie } from "~/storage/rememberLogin.server";
import { findUserByEmail, User } from "~/domain/user";
import {
  canEnterFsc,
  fscIsOlderThanOneDay,
  fscIsTooOld,
  needsToStartIdentification,
} from "~/domain/identificationStatus";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich angemeldet.") };
};

const getNextStepUrl = (user: User) => {
  if (!user.inDeclarationProcess) return "/formular/erfolg";
  if (needsToStartIdentification(user)) return "/identifikation";
  return "/formular";
};

const getFscStepUrl = (user: User) => {
  if (!canEnterFsc(user)) return;
  if (fscIsTooOld(user)) return "/fsc/abgelaufen";
  if (fscIsOlderThanOneDay(user)) return "/fsc";
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
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

  const user: User | null = await findUserByEmail(sessionUser.email);
  if (!user) return logoutDeletedUser(request);

  return {
    email: sessionUser.email,
    nextStepUrl: getNextStepUrl(user),
    fscStepUrl: getFscStepUrl(user),
    flags: flags.getAllFlags(),
  };
};
export default function ErfolgreichAngemeldet() {
  const { email, nextStepUrl, fscStepUrl, flags } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout email={email} flags={flags} path={location.pathname}>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout>
          <Headline> Sie haben sich erfolgreich angemeldet. </Headline>
          {fscStepUrl && (
            <IntroText>
              Sie können die Bearbeitung jederzeit unterbrechen und fortführen.
              Bitte beachten Sie, dass dies nur am Gerät und Browser möglich
              ist, in dem Sie sich registriert haben.
            </IntroText>
          )}
          {!fscStepUrl && (
            <>
              <IntroText>
                Sie können die Bearbeitung jederzeit unterbrechen und
                fortführen.
              </IntroText>

              <IntroText className="mb-48">
                Bitte beachten Sie, das dies nur am Gerät und Browser möglich
                ist, in dem Sie sich registriert haben.
              </IntroText>
            </>
          )}
          <Button
            data-testid="continue"
            to={nextStepUrl}
            className="min-w-[18rem]"
          >
            Verstanden & weiter
          </Button>

          {fscStepUrl && (
            <div className="mt-80">
              <h2 className="mb-32 text-30 leading-36">
                Sie haben einen Freischaltcode beantragt, um sich zu
                identifizieren.
              </h2>
              <IntroText>
                Geben Sie Ihren Freischaltcode jetzt ein oder erhalten Sie Hilfe
                zu dem Thema
              </IntroText>
              <Button
                look="secondary"
                data-testid="continue-fsc"
                to={fscStepUrl}
                className="min-w-[18rem]"
              >
                Zum Freischaltcode
              </Button>
            </div>
          )}
        </SuccessPageLayout>
      </ContentContainer>
    </UserLayout>
  );
}
