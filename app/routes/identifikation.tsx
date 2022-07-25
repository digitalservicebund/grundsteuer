import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
} from "~/components";
import ident1 from "~/assets/images/ident-1.png";
import ident2 from "~/assets/images/ident-2.png";
import ident3 from "~/assets/images/ident-3.png";
import { ReactNode } from "react";
import classNames from "classnames";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { authenticator } from "~/auth.server";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";
import { pageTitle } from "~/util/pageTitle";

export const getRedirectionParams = (
  url: string,
  additionalParams?: boolean
) => {
  const urlObject = new URL(url);
  const redirectToSummary = urlObject.searchParams.get("redirectToSummary");
  if (additionalParams) {
    return redirectToSummary ? "&redirectToSummary=true" : "";
  }
  return redirectToSummary ? "?redirectToSummary=true" : "";
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const params = getRedirectionParams(request.url);

  if (!testFeaturesEnabled) {
    return redirect("/fsc" + params);
  }

  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );

  const hasFscRequest = dbUser.fscRequest;
  if (hasFscRequest) {
    return redirect("/fsc/eingeben" + params);
  }

  return {};
};

export default function Identifikation() {
  return (
    <UserLayout>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>Mit welcher Option möchten Sie sich identifizieren?</Headline>
        <IntroText>
          Damit wir sicher gehen können, dass Sie die Person sind, die die
          Grundsteuererklärung abgibt, müssen Sie sich identifizieren.
        </IntroText>
      </ContentContainer>
      <ContentContainer size="lg">
        <IdentCard
          image={ident1}
          imageAltText="Bildbeispiel der Oberfläche für ELSTER Zugang"
          heading="Identifikation mit ELSTER"
          subheading="Empfohlen für Nutzer:innen mit einem Elster-Konto."
          text="Identifizieren Sie sich mit den Zugangsdaten für Ihr Elster&#8209;Konto um die Grundsteuererklärung abzuschicken."
          buttonLabel="Identifikation mit ELSTER Konto"
          url="/ekona"
          className="mb-16"
        />
        <IdentCard
          image={ident2}
          imageAltText="Bildbeispiel Freischaltcode"
          heading="Identifikation mit Brief"
          subheading="Empfohlen für Nutzer:innen ohne Elster-Konto."
          text="Sie erhalten einen Freischaltcode an Ihre Meldeadresse. Sie können die Erklärung ausfüllen und nach Erhalt des Codes abschicken."
          buttonLabel="Freischaltcode beantragen"
          url="/fsc"
          className="mb-16"
        />
        <IdentCard
          image={ident3}
          imageAltText="Illustration Später Identifizieren"
          heading="Später identifizieren"
          text="Füllen Sie das Formular aus und identifizieren Sie sich später vor dem Versand. Hinweis: Ein Versand ohne Identifikation ist nicht möglich."
          buttonLabel="Zum Formular"
          url="/formular"
          className="mb-16"
        />
      </ContentContainer>
    </UserLayout>
  );
}

function IdentCard(props: {
  image: string;
  imageAltText: string;
  heading: ReactNode | string;
  subheading?: string;
  text: ReactNode | string;
  buttonLabel: string;
  url: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "py-24 lg:px-32 px-24 enumerate-card flex-col md:flex-row max-w-[970px]",
        props.className
      )}
    >
      <img
        src={props.image}
        alt={props.imageAltText}
        className="mr-24 md:w-[300px] w-full"
      />
      <div className="flex flex-col">
        <ContentContainer size="sm">
          <dl>
            <div className="flex flex-row mt-24 md:mt-0">
              <dt className="mb-8 font-bold text-18">{props.heading}</dt>
            </div>
            <div className="flex flex-row mt-8 lg:mt-0">
              <dd>
                {props.subheading && (
                  <p className="font-bold text-blue-800">{props.subheading}</p>
                )}
                <p className="mb-24">{props.text}</p>
                <Button
                  look="primary"
                  size="medium"
                  className="min-w-[248px]"
                  to={props.url}
                >
                  {props.buttonLabel}
                </Button>
              </dd>
            </div>
          </dl>
        </ContentContainer>
      </div>
    </div>
  );
}
