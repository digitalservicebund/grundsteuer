import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
} from "~/components";
import pinbriefImage from "~/assets/images/pinbrief.png";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";

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

  return {
    isMobile: isMobileUserAgent(request),
  };
};

export default function BundesIdentVoraussetzung() {
  const { isMobile } = useLoaderData();
  return (
    <ContentContainer size="sm-md">
      <div>
        <Headline>
          Voraussetzung für die Identifikation mit Ihrem Ausweis
        </Headline>
        <ul className="list-disc pl-24 text-18 leading-26 mb-16">
          <li className="mb-8">
            Sie erinnern sich an Ihre 6-stellige persönliche Ausweis-PIN.
          </li>
          <span className="block ml-[-24px] mb-8">oder</span>
          <li>
            Sie haben noch Ihren PIN‑Brief. Den PIN‑Brief haben Sie nach der
            Beantragung des Ausweises per Post erhalten.
          </li>
        </ul>
        <div className="flex justify-center lg:justify-start mb-48">
          <img
            src={pinbriefImage}
            className="max-w-[180px]"
            alt="Beispiel für einen PIN-Brief"
          />
        </div>
        <ButtonContainer className="lg:max-w-[365px]">
          <Button
            className="w-full lg:max-w-[203px]"
            look="primary"
            to={
              isMobile ? "/bundesIdent" : "/bundesIdent/desktopguide/magiclink"
            }
          >
            Verstanden & weiter
          </Button>
          <Button
            className="w-full lg:max-w-[138px]"
            look="secondary"
            to={"/identifikation?origin=back"}
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
