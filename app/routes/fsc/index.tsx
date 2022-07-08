import { LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { findUserByEmail } from "~/domain/user";
import { authenticator } from "~/auth.server";

export const getNextStepLink = async (url: string, userMail: string) => {
  const urlObject = new URL(url);
  const redirectToSummary = urlObject.searchParams.get("redirectToSummary");
  if (redirectToSummary) {
    return "/formular/zusammenfassung";
  }

  const user = await findUserByEmail(userMail);
  invariant(
    user,
    "expected a matching user in the database from a user in a cookie session"
  );
  if (!user.inDeclarationProcess) {
    return "/formular/erfolg";
  }
  return "/formular/welcome";
};

export const getRedirectionParams = (
  url: string,
  additionalParams?: boolean
) => {
  const urlObject = new URL(url);
  const redirectToSummary = urlObject.searchParams.get("redirectToSummary");
  if (additionalParams) {
    return redirectToSummary ? "&redirectToSummary=true" : "";
  }
  return redirectToSummary ? "?redirectToSummary=true" : "";
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );

  const params = getRedirectionParams(request.url);
  const hasFscRequest = dbUser.fscRequest;
  if (hasFscRequest) {
    return redirect("/fsc/eingeben" + params);
  }
  return redirect("/fsc/beantragen" + params);
};

export default function FscIndex() {
  return null;
}
