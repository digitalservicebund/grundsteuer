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
import installStepImage from "~/assets/images/bundesident-step-install.png";
import identStartStepImage from "~/assets/images/bundesident-step-identstart.png";
import identSuccessStepImage from "~/assets/images/bundesident-step-identsuccess.png";
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
            heading="Identifikation nicht erfolgreich abgeschlossen"
            className="mb-32"
          >
            Stellen Sie sicher, dass Sie sich auf dem Smartphone erfolgreich
            identifiziert haben.
          </ErrorBar>
        )}
      </ContentContainer>
      <ContentContainer size="sm-md">
        <p className="mb-16 text-gray-900">Schritt 3 von 3</p>
        <Headline>
          Installieren Sie BundesIdent und identifizieren Sie sich mit Ihrem
          Ausweis
        </Headline>
      </ContentContainer>

      <ContentContainer size="md-lg">
        <h3 className="text-18 leading-26 mb-32">
          Bei Fragen oder Problemen empfehlen wir Ihnen unseren{" "}
          <a
            className="font-bold text-blue-800 underline"
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/24-identifikation-mit-bundesident-app-beta"
            rel="noopener"
            target="_blank"
          >
            Hilfebereich
          </a>
          .
        </h3>
      </ContentContainer>

      <ContentContainer size="lg">
        <EnumeratedCard
          image={installStepImage}
          imageAltText=""
          number="1"
          heading="Installieren Sie die BundesIdent App"
          text="Sie müssen die App noch nicht öffnen."
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
        <EnumeratedCard
          image={identStartStepImage}
          imageAltText=""
          number="2"
          heading="Wechseln Sie zurück zur Grundsteuer‑Website und tippen Sie auf »Mit BundesIdent ausweisen«"
          text="Anschließend öffnet sich die BundesIdent App automatisch."
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
        <EnumeratedCard
          image={identSuccessStepImage}
          imageAltText=""
          number="3"
          heading="Folgen Sie den weiteren Anweisungen in der BundesIdent App, bis Sie sich erfolgreich identifiziert haben"
          text=""
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
      </ContentContainer>
      <ContentContainer size="lg">
        <ButtonContainer className="max-w-[417px] mt-24">
          <Form reloadDocument method="get">
            <input name="reload" hidden readOnly value="true" />
            <Button className="w-[252px]" look="primary">
              Weiter
            </Button>
          </Form>
          <Button
            className="w-[141px]"
            look="secondary"
            to="/bundesIdent/desktopguide/ausweisoption"
          >
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
