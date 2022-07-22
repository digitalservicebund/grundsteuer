import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { getNextStepLink } from "~/util/getNextStepLink";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  return json({
    nextStepLink: getNextStepLink(request.url),
  });
};

export default function FscBeantragenErfolgreich() {
  const loaderData = useLoaderData();
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Ihr Freischaltcode wurde erfolgreich gespeichert.</Headline>
        <IntroText className="mb-80">
          Sie können Ihre Grundsteuererklärung ab jetzt jederzeit an Ihr
          Finanzamt übermitteln.
        </IntroText>

        <Button to={loaderData.nextStepLink}>Zur Grundsteuererklärung</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
