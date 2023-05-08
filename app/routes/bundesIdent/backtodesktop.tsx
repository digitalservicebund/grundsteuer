import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { Button, ContentContainer, Headline } from "~/components";
import backToDesktopImage from "~/assets/images/bundesident-back-to-desktop.png";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle(
      "Klicken Sie am Computer bzw. Tablet auf »Weiter«, um fortzufahren"
    ),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  return {};
};

export default function BackToDesktop() {
  return (
    <ContentContainer size="sm-md">
      <div data-testid="backtodesktop">
        <Headline>
          Klicken Sie am Computer bzw. Tablet auf »Weiter«, um fortzufahren
        </Headline>
        <p className="text-18 leading-6 mb-32">
          Stellen Sie sicher, dass Sie am Computer bzw. Tablet bei Grundsteuer
          angemeldet sind und folgende Webseite geöffnet ist:{" "}
          www.grundsteuererklaerung-fuer-privateigentum.de/bundesident/desktop
        </p>
        <div className="flex justify-center mb-12 bg-blue-200 rounded-lg">
          <img src={backToDesktopImage} className="max-h-[256px]" alt="" />
        </div>
      </div>
      <div className="mt-32">
        <Button
          className="w-full lg:max-w-[102px]"
          look="secondary"
          to="/bundesIdent/device"
        >
          Zurück
        </Button>
      </div>
    </ContentContainer>
  );
}
