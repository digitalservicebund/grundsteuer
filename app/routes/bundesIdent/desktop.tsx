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
import anmeldenQRImage from "~/assets/images/anmelden-qr.svg";
import anmeldenSmartphoneImage from "~/assets/images/anmelden-smartphone.png";
import EnumeratedCard from "~/components/EnumeratedCard";
import { Form, useLoaderData } from "@remix-run/react";
import ErrorBar from "~/components/ErrorBar";
import { findUserByEmail, User } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { getSession } from "~/session.server";

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

  const session = await getSession(request.headers.get("Cookie"));
  const hasSurveyShown = Boolean(session.get("hasSurveyShown"));
  session.set("hasSurveyShown", hasSurveyShown);

  const refresh = !!new URL(request.url).searchParams.get("reload");
  if (refresh) {
    return {
      hasSurveyShown,
      showNotIdentifiedError: true,
    };
  }

  return { hasSurveyShown };
};

export default function BundesIdentIndex() {
  const { hasSurveyShown, showNotIdentifiedError } = useLoaderData();
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
          <Button
            look={"secondary"}
            to={
              hasSurveyShown ? "/identifikation" : "/bundesIdent/survey/dropout"
            }
          >
            Zurück zu Identifikationsoptionen
          </Button>
        </ButtonContainer>
        <ContentContainer size="sm" className="mt-64">
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
