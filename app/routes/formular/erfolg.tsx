import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import UebersichtStep from "~/components/form/UebersichtStep";
import erfolgMedium from "~/assets/images/erfolg-medium.svg";
import erfolgSmall from "~/assets/images/erfolg-small.svg";
import transferticketImage from "~/assets/images/erfolg-transferticket.svg";
import erklaerungImage from "~/assets/images/erfolg-erklaerung.svg";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
} from "~/components";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth.server";
import { findUserByEmail, User } from "~/domain/user";
import { useLoaderData } from "@remix-run/react";
import Download from "~/components/icons/mui/Download";
import { ReactNode } from "react";
import Hint from "~/components/Hint";
import EnumeratedList from "~/components/EnumeratedList";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erklärung abgeschickt") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  return {
    transferticket: userData.transferticket,
    pdf: userData.pdf,
  };
};

const DownloadCard = (props: {
  image: string;
  imageAltText: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-blue-200 p-32 flex flex-col lg:flex-row gap-x-16 xl:gap-x-64 gap-y-32 mb-24">
      <div className="flex justify-center lg:items-start">
        <img
          src={props.image}
          alt={props.imageAltText}
          className="max-w-[220px] min-w-0"
        />
      </div>
      <div className="flex flex-col lg:max-w-[400px]">{props.children}</div>
    </div>
  );
};

export default function Erfolg() {
  const { transferticket, pdf } = useLoaderData();
  const transferticketButtonProps = transferticket
    ? { href: "/download/transferticket" }
    : { disabled: true };
  const pdfButtonProps = pdf ? { href: "/download/pdf" } : { disabled: true };
  return (
    <>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <UebersichtStep imageSrc={erfolgMedium} smallImageSrc={erfolgSmall}>
          <Headline>
            Ihre Grundsteuererklärung wurde erfolgreich versendet.
          </Headline>

          <h2 className="text-24 mb-16">Wie geht es jetzt weiter?</h2>
          <p className="mb-32">
            Das Wichtigste: bis zum Jahr 2025 zahlen Sie noch die alte
            Grundsteuer.
          </p>
          <EnumeratedList
            items={[
              "Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet",
              <div>
                Zwischen 2022 und 2024 bekommen Sie <strong>drei Briefe</strong>
                :
                <ul className="list-disc ml-20">
                  <li>Grundsteuerwertbescheid</li>
                  <li>Grundsteuermessbescheid</li>
                  <li>den neuen Grundsteuerbescheid</li>
                </ul>
              </div>,
              "Ab 2025 zahlen Sie die neue Grundsteuer.",
            ]}
            className="mb-32"
          />
        </UebersichtStep>
      </ContentContainer>
      <ContentContainer size="lg">
        <h2 className="text-24 mb-24">Für Ihre Unterlagen</h2>
        <DownloadCard image={transferticketImage} imageAltText="">
          <h3 className="text-18 mb-8">
            Transferticket: Beweis der Übermittlung an ELSTER
          </h3>
          <p className="mb-32">
            Das sogenannte Transferticket ist der Beweis, dass Ihre Erklärung an
            ELSTER erfolgreich übermittelt wurde. Bitte bewahren Sie es gut auf
            – notieren Sie sich das Ticket oder laden sie sich das
            Transferticket als Textdatei herunter.
          </p>
          {transferticket && (
            <div className="mb-16 p-16 border-blue-800 border-2 text-center">
              <p className="text-18 font-bold text-blue-800 break-all">
                {transferticket}
              </p>
            </div>
          )}
          <Button
            target={"_blank"}
            download
            look="primary"
            iconRight={<Download />}
            className="mb-40"
            {...transferticketButtonProps}
          >
            Transferticket als .txt herunterladen
          </Button>
          <Hint className="mb-0">
            Sie können das Transferticket nur innerhalb der ersten 60 Minuten
            nach Erstellung herunterladen.
          </Hint>
        </DownloadCard>

        <DownloadCard image={erklaerungImage} imageAltText="">
          <h3 className="text-18 mb-8">Ihre Grundsteuererklärung</h3>
          <p className="mb-24">
            Hier finden Sie Ihre Grundsteuererklärung als PDF. Wir haben Ihre
            Angaben für den Versand an ELSTER aufbereitet. Das PDF enthält auch
            das Transferticket.
          </p>
          <Button
            target={"_blank"}
            download
            look="primary"
            iconRight={<Download />}
            className="mb-40"
            {...pdfButtonProps}
          >
            Angaben als PDF herunterladen
          </Button>
          <Hint className="mb-0">
            Sie können die Angaben nur innerhalb der ersten 60 Minuten nach
            Erstellung herunterladen.
          </Hint>
        </DownloadCard>
      </ContentContainer>
    </>
  );
}
