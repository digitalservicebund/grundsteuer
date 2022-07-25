import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
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
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { useLoaderData } from "@remix-run/react";
import { getNextStepLink } from "~/util/getNextStepLink";
import { commitSession, getSession } from "~/session.server";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );
  if (!dbUser.identified) {
    return redirect("/identifikation");
  }
  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", Object.assign(session.get("user"), { identified: true }));

  return json(
    {
      nextStepLink: getNextStepLink(request.url),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function EkonaErfolgreich() {
  const loaderData = useLoaderData();
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Vielen Dank</Headline>

        <IntroText className="mb-80">
          Wir konnten Sie anhand Ihrer ELSTER Zugangsdaten erfolgreich
          identifizieren. Sie können die Erklärung nun nach vollständiger
          Bearbeitung absenden.
        </IntroText>

        <Button to={loaderData.nextStepLink}>Weiter zum Formular</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
