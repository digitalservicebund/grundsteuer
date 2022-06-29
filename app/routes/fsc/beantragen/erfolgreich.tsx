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
import { getNextStepLink } from "~/routes/fsc/index";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export const loader: LoaderFunction = async ({ request }) => {
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
        <Headline>Vielen Dank</Headline>

        <IntroText className="mb-80">
          Sie haben persönlichen Freischaltcode beantragt. Diesen erhalten Sie
          in den nächsten 14 Tagen per Post.
        </IntroText>

        <Button to={loaderData.nextStepLink}>Weiter zum Formular</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
