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
import qrCodeStepImage from "~/assets/images/bundesident-step-qrcode.png";
import emailStepImage from "~/assets/images/bundesident-step-email.png";
import anmeldenStepImage from "~/assets/images/bundesident-step-anmelden.png";
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
        <p className="mb-16 text-gray-900">Schritt 1 von 3</p>
        <Headline>
          Identifizieren Sie sich in wenigen Minuten mit Ihrem Ausweis
        </Headline>
        <h3 className="text-18 leading-26 mb-24">
          Nachdem Sie sich auf dem Smartphone identifiziert haben, können Sie
          zum Computer bzw. Tablet zurückkehren und Ihre Grundsteuererklärung
          weiter bearbeiten.
        </h3>
      </ContentContainer>

      <ContentContainer size="lg">
        <EnumeratedCard
          image={qrCodeStepImage}
          imageAltText=""
          number="1"
          heading="Scannen Sie den QR‑Code mit Ihrem Smartphone"
          text="Alternativ können Sie den Link auch manuell im Browser eingeben: www.bundesident.de/gfp"
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
        <EnumeratedCard
          image={emailStepImage}
          imageAltText=""
          number="2"
          heading="Geben Sie die E‑Mail-Adresse ein, mit der Sie sich registriert haben"
          text="Klicken Sie anschließend auf »Anmelde-Link senden«."
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
        <EnumeratedCard
          image={anmeldenStepImage}
          imageAltText=""
          number="3"
          heading="Öffnen Sie den Anmelde‑Link in der E‑Mail auf dem Smartphone"
          text="Der integrierte Browser der E‑Mail‑App ist nicht kompatibel. Öffnen Sie den Anmelde‑Link mit dem gleichen Browser, mit dem Sie gerade auch den Anmelde‑Link angefordert haben."
          className="mb-16 px-32 py-32 items-center md:items-start"
          imageStyle="mr-24 max-w-[180px] h-[100%] w-full"
        />
      </ContentContainer>
      <ContentContainer size="lg">
        <ButtonContainer className="max-w-[417px] mt-24">
          <Button
            className="w-[252px]"
            look="primary"
            to="/bundesIdent/desktopguide/ausweisoption"
          >
            Weiter
          </Button>
          <Button
            className="w-[141px]"
            look="secondary"
            to="/bundesIdent/voraussetzung"
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
