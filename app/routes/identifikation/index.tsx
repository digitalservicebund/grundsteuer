import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import ident1 from "~/assets/images/ident-1.png";
import ident2 from "~/assets/images/ident-2.png";
import ident3 from "~/assets/images/ident-3.png";
import bundesIdentCardsImage from "~/assets/images/bundesident-cards.png";
import { ReactNode } from "react";
import classNames from "classnames";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { findUserByEmail } from "~/domain/user";
import SectionLabel from "../../components/navigation/SectionLabel";
import LetterIcon from "~/components/icons/mui/LetterIcon";
import WavingHand from "~/components/icons/mui/WavingHand";
import EdgeSensorHigh from "~/components/icons/mui/EdgeSensorHigh";
import PhotoCameraFront from "~/components/icons/mui/PhotoCameraFront";
import { useLoaderData } from "@remix-run/react";
import Bolt from "~/components/icons/mui/Bolt";
import { pageTitle } from "~/util/pageTitle";
import { flags } from "~/flags.server";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";
import TeaserIdentCard from "~/components/TeaserIdentCard";
import { canEnterFsc } from "~/domain/identificationStatus";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import LinkWithArrow from "~/components/LinkWithArrow";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle("Mit welcher Option möchten Sie sich identifizieren?"),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (sessionUser.identified) {
    return redirect("/identifikation/erfolgreich");
  }

  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  if (dbUser.identified) {
    return redirect("/identifikation/erfolgreich");
  }

  const isDirectLink = !!new URL(request.url).searchParams.get("direct");
  if (canEnterFsc(dbUser) && !isDirectLink) {
    return redirect("/fsc");
  }

  return {
    useUseid: !flags.isBundesIdentDisabled(),
    isMobile: isMobileUserAgent(request),
    ekonaDown: flags.isEkonaDown(),
    ericaDown: flags.isEricaDown(),
    bundesIdentDown: flags.isBundesIdentDown(),
  };
};

export default function IdentifikationIndex() {
  const { useUseid, isMobile, ekonaDown, ericaDown, bundesIdentDown } =
    useLoaderData();
  return (
    <>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>Mit welcher Option möchten Sie sich identifizieren?</Headline>
        <IntroText>
          Damit wir sicher gehen können, dass Sie die Person sind, die die
          Grundsteuererklärung abgibt, müssen Sie sich identifizieren.
        </IntroText>
      </ContentContainer>
      <ContentContainer size="lg">
        {useUseid && isMobile && (
          <div>
            <TeaserIdentCard
              headline={`Die Identifikation mit dem Ausweis wird am Mittwoch, dem\u00A028.\u00A0Juni\u00A02023, eingestellt.`}
            >
              <strong className="hidden lg:inline">
                Die Identifikation mit dem Ausweis wird am Mittwoch,
                dem&nbsp;28.&nbsp;Juni&nbsp;2023, eingestellt.
              </strong>{" "}
            </TeaserIdentCard>
            <IdentCard
              image=""
              imageAltText="Bildbeispiel Ausweis"
              icon={<EdgeSensorHigh className="mr-4" />}
              betaTag={true}
              optionCount={1}
              heading="Identifikation mit Ihrem Ausweis"
              subheading="Empfohlen für Nutzer:innen mit einem Personalausweis und Smartphone."
              text=""
              buttonLabel="Identifikation mit Ausweis"
              buttonDisabled={bundesIdentDown}
              url="/bundesIdent/voraussetzung"
              className="mb-16"
            />
          </div>
        )}
        {useUseid && !isMobile && (
          <div>
            <TeaserIdentCard
              headline={`Die Identifikation mit dem Ausweis wird am Mittwoch, dem\u00A028.\u00A0Juni\u00A02023, eingestellt.`}
            ></TeaserIdentCard>
            <IdentCard
              image={bundesIdentCardsImage}
              imageAltText="Drei kompatible Ausweise: Deutscher Personalausweis, elektronischer Aufenthaltstitel und eID‑Karte für Bürgerinnen und Bürger der Europäischen Union und des europäischen Wirtschaftsraums."
              icon={<EdgeSensorHigh className="mr-4" />}
              betaTag={true}
              optionCount={1}
              heading="Identifikation mit Ihrem Ausweis über Ihr Smartphone"
              subheading="Empfohlen für Nutzer:innen mit einem Personalausweis und Smartphone."
              text="Identifizieren Sie sich in wenigen Minuten mit der Online-Ausweisfunktion Ihres Ausweises und der BundesIdent App."
              buttonLabel="Identifikation mit Ausweis"
              buttonDisabled={bundesIdentDown}
              url="/bundesIdent/voraussetzung"
              className="mb-16 bg-white"
            />
          </div>
        )}
        <IdentCard
          image={ident1}
          imageAltText="Bildbeispiel der Oberfläche für ELSTER Zugang"
          icon={<PhotoCameraFront className="mr-4" />}
          optionCount={useUseid ? 2 : 1}
          heading="Identifikation mit ELSTER"
          subheading="Empfohlen für Nutzer:innen mit einem ELSTER-Konto."
          text="Identifizieren Sie sich mit den Zugangsdaten für Ihr ELSTER‑Konto, um die Grundsteuererklärung abzuschicken."
          buttonLabel="Identifikation mit ELSTER-Konto"
          buttonDisabled={ekonaDown}
          url="/ekona"
          className="mb-16"
        />
        <TeaserIdentCard
          headline={`Die Zusendung des Briefes mit dem Freischaltcode kann bis zu 3\u00A0Wochen dauern.`}
        >
          Planen Sie die Bestellung des Freischaltcodes rechtzeitig ein. Wenn
          Sie oder <u>Ihre Angehörigen</u> ein ELSTER-Zertifikat haben, nutzen
          Sie "Identifikation mit ELSTER".
        </TeaserIdentCard>
        <IdentCard
          image={ident2}
          imageAltText="Bildbeispiel Freischaltcode"
          icon={<LetterIcon fill="#4E596A" className="mr-4" />}
          optionCount={useUseid ? 3 : 2}
          heading="Identifikation mit Freischaltcode"
          subheading="Empfohlen für Nutzer:innen ohne ELSTER-Konto."
          text="Sie erhalten einen Brief mit einem Freischaltcode an Ihre Meldeadresse. Sie können die Erklärung ausfüllen und nach Erhalt des Codes abschicken."
          buttonLabel="Identifikation mit Freischaltcode"
          buttonDisabled={ericaDown}
          url="/fsc"
          className="mb-16 mt-0"
        />
        <IdentCard
          image={ident3}
          imageAltText="Illustration Später Identifizieren"
          icon={<WavingHand className="mr-4" />}
          optionCount={useUseid ? 4 : 3}
          heading="Später identifizieren"
          subheading="Hinweis: Ein Versand ohne Identifikation ist nicht möglich. "
          text="Füllen Sie das Formular aus und identifizieren Sie sich später vor dem Versand. Hinweis: Ein Versand ohne Identifikation ist nicht möglich."
          buttonLabel="Zum Formular"
          url="/formular"
          className="mb-56"
        />
        <ContentContainer size="sm-md">
          <p className="mb-32">
            Nutzen sie das Konto Ihrer{" "}
            <a
              href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/38-abgabe-uber-angehorige-und-bekannte"
              className="text-blue-800 underline font-bold"
              target="_blank"
            >
              nahen Angehörigen
            </a>
            , um über diese Ihre Grundsteuererklärung abzugeben oder lesen Sie
            in unserem Hilfebereich weiter:
          </p>
          <LinkWithArrow
            external
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023/227-welche-alternativen-habe-ich-um-mich-zu-identifizieren"
          >
            Alternativen bei Problemen mit der Identifikation
          </LinkWithArrow>
        </ContentContainer>
      </ContentContainer>
    </>
  );
}

function OptionLabel(props: {
  icon: ReactNode;
  emphasised?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const background: string = props.emphasised ? "yellow" : "white-full";
  return (
    <div
      className={classNames(
        props.className,
        "relative h-[36px] top-[-36px] mb-[-36px] md:hidden"
      )}
    >
      <SectionLabel
        backgroundColor={background as "yellow" | "white-full"}
        icon={props.icon}
        className="h-[36px]"
      >
        {props.children}
      </SectionLabel>
    </div>
  );
}

function IdentCard(props: {
  image: string;
  icon: ReactNode;
  betaTag?: boolean;
  optionCount: number;
  imageAltText: string;
  heading: ReactNode | string;
  subheading?: string;
  text: ReactNode | string;
  buttonLabel: string;
  buttonDisabled?: boolean;
  url: string;
  className?: string;
}) {
  const statusProps = props.buttonDisabled
    ? { disabled: true }
    : { to: props.url };
  return (
    <div
      className={classNames(
        "mt-48 md:mt-0 p-16 lg:py-24 lg:px-32 bg-blue-300 lg:enumerate-card flex-col lg:flex-row max-w-[970px]",
        props.className
      )}
    >
      <OptionLabel icon={props.icon}>Option {props.optionCount} </OptionLabel>
      {props.betaTag && (
        <OptionLabel
          icon={<Bolt className="mr-4" />}
          emphasised={true}
          className="float-right"
        >
          Beta-Stadium
        </OptionLabel>
      )}
      <img
        src={props.image}
        alt={props.imageAltText}
        className="hidden lg:flex mr-24 md:w-[300px] w-full mb-auto bg-white"
      />
      <div className="flex flex-col">
        <dl>
          <div className="flex flex-row mt-16 md:mt-0 justify-between">
            <dt className="mb-8 font-bold text-18">{props.heading}</dt>
            {props.betaTag && (
              <SectionLabel
                backgroundColor="yellow"
                icon={<Bolt className="mr-4" />}
                className="h-[36px] hidden md:flex ml-8 float-right whitespace-nowrap"
              >
                Beta-Stadium
              </SectionLabel>
            )}
          </div>

          <ContentContainer size="sm">
            <div className="flex flex-row mt-8 lg:mt-0">
              <dd className="w-full md:w-fit">
                {props.subheading && (
                  <p className="md:font-bold text-blue-800 mb-16 md:mb-0">
                    {props.subheading}
                  </p>
                )}
                <p className="hidden md:flex mb-24">{props.text}</p>
                <Button
                  look="primary"
                  size="medium"
                  className="w-full md:w-fit min-w-[248px]"
                  {...statusProps}
                >
                  {props.buttonLabel}
                </Button>
              </dd>
            </div>
          </ContentContainer>
        </dl>
      </div>
    </div>
  );
}
