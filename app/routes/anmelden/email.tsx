import { MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Anmeldelink per E-Mail gesendet") };
};

export default function AnmeldenEmail() {
  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout>
          <Headline>Wir haben Ihnen eine E-Mail gesendet.</Headline>
          <IntroText>
            Bitte klicken Sie auf den Anmeldelink in der E-Mail.
          </IntroText>
        </SuccessPageLayout>
      </ContentContainer>
    </UserLayout>
  );
}
