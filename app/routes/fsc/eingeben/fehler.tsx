import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import EnumeratedList from "~/components/EnumeratedList";
import LinkWithArrow from "~/components/LinkWithArrow";
import { getBundesIdentUrl } from "~/routes/bundesIdent/_bundesIdentUrl";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle("Es gab ein technisches Problem mit Ihrem Freischaltcode"),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  return { bundesIdentUrl: getBundesIdentUrl(request) };
};

export default function FscBeantragenErfolgreich() {
  const { bundesIdentUrl } = useLoaderData();
  return (
    <>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <ContentContainer size="sm">
          <Headline>
            Es gab ein technisches Problem mit Ihrem Freischaltcode.
          </Headline>
          <IntroText>
            Auf Grund eines technischen Problems zwischen unserem Online-Dienst
            und ELSTER kann Ihr Freischaltcode nicht mehr verwendet werden.
          </IntroText>
        </ContentContainer>

        <h2 className="text-24 mb-32">Folgende Lösung schlagen wir vor:</h2>

        <EnumeratedList
          gap="48"
          items={[
            <div>
              <p className="mb-8">
                <strong>Elster-Zertifikat</strong>: Unter ELSTER können Sie sich
                ein Konto anlegen. Dafür registrieren Sie sich zunächst und
                erhalten dann Ihre Aktivierungsdaten per Post. Mit diesen Daten
                erhalten Sie nach Eingabe bei ELSTER eine Zertifikatsdatei per
                Download, mit der Sie sich in unserem Online-Dienst
                identifizieren können.
              </p>
              <LinkWithArrow href="/ekona">
                Zur Identifikation mit ELSTER Zugang
              </LinkWithArrow>
            </div>,
            <div>
              <p className="mb-8">
                <strong>Ausweis und Smartphone</strong>: Sie haben außerdem die
                Möglichkeit sich mit Ihrem Ausweis auf dem Smartphone zu
                identifizieren.
              </p>
              <LinkWithArrow href={bundesIdentUrl}>
                Zur Identifikation mit Personalausweis
              </LinkWithArrow>
            </div>,
            <div>
              <p className="mb-8">
                <strong>Freischaltcode neu beantragen</strong>: Sie können den
                Freischaltcode auch neu beantragen. Sollte dieser nach der Frist
                eintreffen, geben Sie Ihre Erklärung trotzdem schnellstmöglich
                nach Erhalt ab.
              </p>
              <LinkWithArrow href="/fsc/stornieren">
                Freischaltcode neu beantragen
              </LinkWithArrow>
            </div>,
          ]}
        />
      </ContentContainer>
    </>
  );
}
