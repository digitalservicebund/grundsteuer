import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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

export const meta: MetaFunction = () => {
  return { title: pageTitle("Anmeldelink per E-Mail gesendet") };
};

export default function AnmeldenEmail() {
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
            <Link to="/anmelden" className="font-bold underline">
              erneut
            </Link>
            .
          </IntroText>
        </SuccessPageLayout>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
