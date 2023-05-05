import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { isMobile, isAndroid, isIOS } from "react-device-detect";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
} from "~/components";
import appReviewImage from "~/assets/images/bundesident-appreview.png";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { Form } from "@remix-run/react";

const handleAppStoreBewertenButton = () => {
  const iOSAppStoreUrl =
    "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1635758944";
  const AndroidPlayStoreUrl =
    "https://play.google.com/store/apps/details?id=de.digitalService.useID";

  if (isMobile && isAndroid) {
    window.open(AndroidPlayStoreUrl, "_blank", "noopener");
  }

  if (isMobile && isIOS) {
    window.open(iOSAppStoreUrl, "_blank");
  }
};

export const meta: MetaFunction = () => {
  return {
    title: pageTitle(
      "Wir freuen uns über Ihre Bewertung im App bzw. Play Store"
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

export const action: ActionFunction = async () =>
  redirect("/bundesIdent/device");

export default function BackToDesktop() {
  return (
    <ContentContainer size="sm-md">
      <div data-testid="backtodesktop">
        <Headline>
          Wir freuen uns über Ihre Bewertung im App bzw. Play Store
        </Headline>
        <div className="flex justify-center mb-12 bg-blue-200 rounded-lg">
          <img
            src={appReviewImage}
            className="max-h-[256px]"
            alt="Drei kompatible Ausweise: Deutscher Personalausweis, elektronischer Aufenthaltstitel und eID‑Karte für Bürgerinnen und Bürger der Europäischen Union und des europäischen Wirtschaftsraums."
          />
        </div>
      </div>
      <div className="mt-32">
        <Form onSubmit={handleAppStoreBewertenButton} method="post">
          <ButtonContainer className="mt-32 max-w-[520px] lg:max-w-[400px]">
            <Button className="w-full lg:max-w-[224px]" look="primary">
              BundesIdent Bewerten
            </Button>
            <Button
              className="w-full lg:max-w-[152px]"
              look="tertiary"
              to="/bundesIdent/device"
            >
              Überspringen
            </Button>
          </ButtonContainer>
        </Form>
      </div>
    </ContentContainer>
  );
}
