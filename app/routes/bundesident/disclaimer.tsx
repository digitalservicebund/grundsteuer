import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { Button, ButtonContainer, Headline, SectionLabel } from "~/components";
import pinbriefImage from "~/assets/images/pinbrief.png";
import Bolt from "~/components/icons/mui/Bolt";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit Ausweis") };
};

export const loader: LoaderFunction = async ({ request }) => {
  if (process.env.USE_USE_ID !== "true") {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (sessionUser.identified) {
    return redirect("/identifikation/erfolgreich");
  }
  return {};
};

export default function BundesIdentDisclaimer() {
  return (
    <div>
      <SectionLabel
        icon={<Bolt className="mr-4" />}
        backgroundColor="yellow"
        className="mb-16"
      >
        Beta-Status
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
          Sie haben noch Ihren PIN-Brief. <br /> Den PIN-Brief haben Sie nach
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
        <Button to="/bundesident">Verstanden & weiter</Button>
        <Button to="/identifikation" look="secondary">
          Zurück zu Identifikationsoptionen
        </Button>
      </ButtonContainer>
    </div>
  );
}
