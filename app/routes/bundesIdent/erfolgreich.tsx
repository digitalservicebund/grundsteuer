import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  if (!dbUser.identified) {
    return redirect("/identifikation");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const hasSurveyShown = Boolean(session.get("hasSurveyShown"));
  session.set("hasSurveyShown", hasSurveyShown);

  return {
    hasSurveyShown,
    isMobile: isMobileUserAgent(request),
  };
};

export default function BundesIdentErfolgreich() {
  const { hasSurveyShown, isMobile } = useLoaderData();

  return (
    <IdentificationSuccess
      backButton="start"
      identificationType="bundesIdent"
      hasSurveyShown={hasSurveyShown}
      isMobile={isMobile}
    ></IdentificationSuccess>
  );
}
