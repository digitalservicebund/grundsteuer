import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  SectionLabel,
} from "~/components";
import pinbriefImage from "~/assets/images/pinbrief.png";
import Bolt from "~/components/icons/mui/Bolt";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";
import { getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit Ausweis") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (sessionUser.identified) {
    return redirect("/identifikation/erfolgreich");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const hasSurveyShown = Boolean(session.get("hasSurveyShown"));
  session.set("hasSurveyShown", hasSurveyShown);

  return {
    isMobile: isMobileUserAgent(request),
    hasSurveyShown,
  };
};

export default function BundesIdentVoraussetzung() {
  const { isMobile, hasSurveyShown } = useLoaderData();
  return (
    <ContentContainer size="sm-md">
      <div>
        <SectionLabel
          icon={<Bolt className="mr-4" />}
          backgroundColor="yellow"
          className="mb-16"
        >
          Beta-Stadium
        </SectionLabel>
        <Headline>
          Voraussetzung für die Identifikation mit Ihrem Ausweis
        </Headline>
        <ul className="list-disc pl-24 text-18 leading-26 mb-16">
          <li className="mb-8">
            Sie erinnern sich an Ihre 6-stellige persönliche Ausweis-PIN.
          </li>
          <span className="block ml-[-24px] mb-8">oder</span>
          <li>
            Sie haben noch Ihren PIN‑Brief. <br /> Den PIN‑Brief haben Sie nach
            der Beantragung des Ausweises per Post erhalten.
          </li>
        </ul>
        <div className="flex justify-center lg:justify-start mb-48">
          <img
            src={pinbriefImage}
            className="max-w-[180px]"
            alt="Beispiel für einen PIN-Brief"
          />
        </div>
        <ButtonContainer className="lg:max-w-[329px]">
          <Button
            className="w-full lg:max-w-[203px]"
            look="primary"
            to={isMobile ? "/bundesIdent" : "/bundesIdent/desktop"}
          >
            Verstanden & weiter
          </Button>
          <Button
            className="w-full lg:max-w-[102px]"
            look="secondary"
            to={
              hasSurveyShown ? "/identifikation" : "/bundesIdent/survey/dropout"
            }
          >
            Zurück
          </Button>
        </ButtonContainer>
      </div>
      <div className="mt-[60px]">
        <p className="text-18 leading-26">
          Bei Fragen oder Problemen melden Sie sich unter:{" "}
          <a
            href="mailto:hilfe@bundesident.de"
            className="font-bold text-blue-800 underline"
          >
            hilfe@bundesident.de
          </a>
        </p>
      </div>
    </ContentContainer>
  );
}
