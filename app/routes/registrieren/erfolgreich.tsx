import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  BreadcrumbNavigation,
  ContentContainer,
  EmailStatus,
  Headline,
  IntroText,
  LoggedOutLayout,
  SubHeadline,
  SuccessPageLayout,
} from "~/components";
import { getStatus, getUiStatus } from "~/email.server";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich"), robots: "noIndex" };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const messageId = url.searchParams.get("message");

  if (!messageId) {
    // old behavior
    return {};
  }

  const status = await getStatus(messageId);

  if (!status) {
    throw new Response("Not found", { status: 404 });
  }

  const uiStatus = getUiStatus(status.event, status.reason);

  return { email: status.email, uiStatus };
};

export default function RegistrierenErfolgreich() {
  const { email, uiStatus } = useLoaderData();

  if (email) {
    return (
      <LoggedOutLayout>
        <BreadcrumbNavigation />
        <EmailStatus
          email={email}
          currentStatus={uiStatus}
          actionPath="/registrieren"
          actionLabel="Zurück zur Registrierung"
        />
      </LoggedOutLayout>
    );
  }

  return (
    <LoggedOutLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout lowVersion>
          <Headline>Wir haben Ihnen eine E-Mail gesendet.</Headline>
          <IntroText className="mb-80">
            Bitte schauen Sie in Ihr E-Mail Postfach und klicken Sie auf den
            Link in der E-Mail. Damit werden Sie angemeldet.
          </IntroText>
          <SubHeadline>Sie haben keine E-Mail erhalten?</SubHeadline>
          <IntroText>
            Bitte warten Sie 5 Minuten oder schauen Sie im Spam-Ordner Ihres
            Postfachs nach. Oder versuchen Sie es{" "}
            <Link to="/registrieren" className="font-bold underline">
              erneut
            </Link>
            .
          </IntroText>
        </SuccessPageLayout>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
