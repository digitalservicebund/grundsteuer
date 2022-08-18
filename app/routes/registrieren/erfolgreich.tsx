import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  IntroText,
  LoggedOutLayout,
  SubHeadline,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich") };
};

export const loader: LoaderFunction = async () => {
  return {
    showTestFeatures: testFeaturesEnabled(),
  };
};

export default function RegistrierenErfolgreich() {
  const loaderData = useLoaderData();
  return (
    <LoggedOutLayout showNewFeatures={loaderData.showTestFeatures}>
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
