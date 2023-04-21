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
import loginStepimage from "~/assets/images/bundesident-step-login.png";
import identOptionStepImage from "~/assets/images/bundesident-step-identoption.png";
import EnumeratedCard from "~/components/EnumeratedCard";
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

  return {};
};

export default function BundesIdentIndex() {
  return (
    <>
      <ContentContainer size="sm-md">
        <p className="mb-16 text-gray-900">Schritt 2 von 3</p>
        <Headline>
          Wählen Sie wieder die Option »Identifikation mit Ausweis«
        </Headline>
      </ContentContainer>

      <ContentContainer size="lg">
        <EnumeratedCard
          image={loginStepimage}
          imageAltText=""
          number="1"
          heading="Klicken Sie auf »Verstanden & weiter«"
          text=""
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
        <EnumeratedCard
          image={identOptionStepImage}
          imageAltText=""
          number="2"
          heading="Klicken Sie auf »Identifikation mit Ausweis«"
          text=""
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
      </ContentContainer>
      <ContentContainer size="lg">
        <ButtonContainer className="max-w-[417px] mt-24">
          <Button
            className="w-[252px]"
            look="primary"
            to="/bundesIdent/desktop"
          >
            Weiter
          </Button>
          <Button
            className="w-[141px]"
            look="secondary"
            to="/bundesIdent/desktopguide/magiclink"
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
