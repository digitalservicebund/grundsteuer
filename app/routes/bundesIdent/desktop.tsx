import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
} from "~/components";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";
import anmeldenQRImage from "~/assets/images/anmelden-qr.svg";
import anmeldenSmartphoneImage from "~/assets/images/anmelden-smartphone.png";
import EnumeratedCard from "~/components/EnumeratedCard";
import { Form, useLoaderData } from "@remix-run/react";
import ErrorBar from "~/components/ErrorBar";
import { findUserByEmail, User } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle(
      "Identifizieren Sie sich mit Ihrem Ausweis auf dem Smartphone"
    ),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const dbUser: User | null = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  if (dbUser.identified) {
    return redirect("/bundesIdent/erfolgreich");
  }

  if (isMobileUserAgent(request)) {
    return redirect("/bundesIdent");
  }

  const refresh = !!new URL(request.url).searchParams.get("reload");
  if (refresh) {
    return {
      showNotIdentifiedError: true,
    };
  }

  return {};
};

export default function BundesIdentIndex() {
  const { showNotIdentifiedError } = useLoaderData();
  return (
    <>
      <ContentContainer size="md">
        {showNotIdentifiedError && (
          <ErrorBar
            heading="Identifikation nicht abgeschlossen"
            className="mb-32"
          >
            Stellen Sie sicher, dass Sie die Identifikation auf dem Smartphone
            mit der BundesIdent App abgeschlossen haben.
          </ErrorBar>
        )}
      </ContentContainer>
      <ContentContainer size="sm-md">
        <Headline>
          Identifizieren Sie sich in wenigen Minuten mit Ihrem Ausweis
        </Headline>
      </ContentContainer>

      <ContentContainer size="lg">
        <h2 className="text-24 mb-24">Nächste Schritte:</h2>
        <EnumeratedCard
          image={anmeldenQRImage}
          imageAltText="QR-Code um zu folgender URL zu gelangen: www.bundesident.de/gfp"
          number="1"
          heading="Wechseln Sie zu Grundsteuer auf Ihrem Smartphone"
          text="Öffnen Sie Grundsteuer-Webseite auf Ihrem Smartphone, um die Bearbeitung fortzusetzen: www.bundesident.de/gfp Alternativ können Sie auch den QR-Code scannen."
          className="mb-16"
        />
        <EnumeratedCard
          image={anmeldenSmartphoneImage}
          imageAltText="Bildbeispiel für Anmeldung auf dem Smartphone"
          number="2"
          heading="Melden Sie sich auf dem Smartphone an, wählen Sie erneut »Identifikation mit Ausweis« als Option"
          text="Nutzen Sie für die Anmeldunng dieselbe E-Mail-Adresse, mit der Sie sich registriert haben. Wählen Sie wieder die Identifikationsoption »Identifikation mit Ihrem Ausweis über Ihr Smartphone« und folgen Sie den weiteren Hinweisen."
        />
      </ContentContainer>
      <ContentContainer size="lg">
        <ButtonContainer className="mt-24">
          <Form reloadDocument method="get">
            <input name="reload" hidden readOnly value="true" />
            <Button look={"primary"}>
              Identifikation abgeschlossen & Seite neu laden
            </Button>
          </Form>
          <Button look={"secondary"} to="/voraussetzung">
            Zurück
          </Button>
        </ButtonContainer>
        <ContentContainer size="md-lg" className="mt-64">
          Bei Problemen mit der BundesIdent App melden Sie sich unter:{" "}
          <a
            href="mailto:hilfe@bundesident.de"
            className="font-bold text-blue-800 underline"
          >
            hilfe@bundesident.de
          </a>
        </ContentContainer>
      </ContentContainer>
    </>
  );
}
