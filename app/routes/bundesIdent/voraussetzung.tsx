import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { Button, ButtonContainer, Headline, SectionLabel } from "~/components";
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
      <div className="flex justify-center mb-48">
        <img
          src={pinbriefImage}
          className="max-w-[180px]"
          alt="Beispiel für einen PIN-Brief"
        />
      </div>
      <ButtonContainer>
        <Button to="/bundesIdent">Verstanden & weiter</Button>
        <Button
          to={
            isMobile && hasSurveyShown
              ? "/identifikation"
              : "/bundesIdent/survey/dropout"
          }
          look="secondary"
        >
          Zurück zu Identifikationsoptionen
        </Button>
      </ButtonContainer>
    </div>
  );
}
