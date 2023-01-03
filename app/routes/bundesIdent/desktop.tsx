import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";
import Hint from "~/components/Hint";
import anmeldenQRImage from "~/assets/images/anmelden-qr.svg";
import anmeldenSmartphoneImage from "~/assets/images/anmelden-smartphone.png";
import EnumeratedCard from "~/components/EnumeratedCard";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { Form, useLoaderData } from "@remix-run/react";
import ErrorBar from "~/components/ErrorBar";
import { findUserByEmail, User } from "~/domain/user";
import invariant from "tiny-invariant";

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

  if (!testFeaturesEnabled()) {
    throw new Response("Not found", { status: 404 });
  }

  const dbUser: User | null = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );
  if (dbUser.identified) {
    return redirect("/identifikation/erfolgreich");
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
          Schnell und sicher mit der BundesIdent App auf Ihrem Smartphone
          identifizieren
        </Headline>

        <Hint>Nur für digitalaffine Nutzerinnen und Nutzer empfohlen.</Hint>

        <IntroText>
          In Ihrem Ausweis befindet sich ein Chip, der mithilfe der BundesIdent
          App und Ihrer PIN ausgelesen werden kann. So können Sie sich sicher
          online identifizieren.
        </IntroText>

        <h2 className="font-bold text-18 leading-26">Sie benötigen</h2>
        <ul className="list-disc pl-24 mb-32 text-18 leading-26">
          <li>
            Entweder Ihre 6-stellige persönliche Ausweis‑PIN oder Ihren
            PIN‑Brief. Den PIN‑Brief haben Sie nach der Beantragung des
            Ausweises per Post erhalten.
          </li>
          <li>
            Entweder ein Android mit der Version 9 »Pie« oder neuer und
            integriertem NFC-Sensor oder ein iPhone 7 mit iOS 15 oder neuer.
          </li>
        </ul>
      </ContentContainer>

      <ContentContainer size="lg">
        <h2 className="text-24 mb-24">Nächste Schritte:</h2>
        <EnumeratedCard
          image={anmeldenQRImage}
          imageAltText="QR-Code um zu folgender URL zu gelangen: www.grundsteuererklaerung-fuer-privateigentum.de/anmelden"
          number="1"
          heading="Wechseln Sie zu Grundsteuer auf Ihrem Smartphone"
          text="Öffnen Sie Grundsteuererklärung für Privateigentum auf Ihrem Smartphone, um die Bearbeitung fortzusetzen: www.grundsteuererklaerung-fuer-privateigentum.de/anmelden. Alternativ können Sie auch den QR-Code scannen."
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
          <Button look={"secondary"} to="/identifikation">
            Zurück zu Identifikationsoptionen
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </>
  );
}
