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
import { commitSession, getSession } from "~/session.server";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!sessionUser.identified) {
    const dbUser = await findUserByEmail(sessionUser.email);
    invariant(
      dbUser,
      "expected a matching user in the database from a user in a cookie session"
    );
    if (!dbUser.identified) {
      return redirect("/identifikation");
    }
    const session = await getSession(request.headers.get("Cookie"));
    session.set(
      "user",
      Object.assign(session.get("user"), { identified: true })
    );

    return json(
      {},
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
  return {};
};

export default function EkonaErfolgreich() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Vielen Dank</Headline>

        <IntroText className="mb-80">
          Wir konnten Sie anhand Ihrer ELSTER-Zugangsdaten erfolgreich
          identifizieren. Sie können die Erklärung nun nach vollständiger
          Bearbeitung absenden.
        </IntroText>

        <Button to="/formular">Weiter zum Formular</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
