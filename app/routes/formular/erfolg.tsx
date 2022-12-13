import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import transferticketImage from "~/assets/images/erfolg-transferticket.svg";
import erklaerungImage from "~/assets/images/erfolg-erklaerung.svg";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  IntroText,
} from "~/components";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth.server";
import { findUserByEmail, User } from "~/domain/user";
import { useLoaderData } from "@remix-run/react";
import Download from "~/components/icons/mui/Download";
import { ReactNode } from "react";
import Hint from "~/components/Hint";
import EnumeratedList from "~/components/EnumeratedList";
import Plus from "~/components/icons/mui/Plus";
import Check from "~/components/icons/mui/Check";

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

  if (userData.inDeclarationProcess) {
    return redirect("/formular/welcome");
  }

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
    <div className="bg-blue-200 p-32 flex flex-col lg:flex-row xl:gap-x-4 gap-y-32 mb-24">
      <div className="flex justify-center md:min-w-[200px] lg:items-start">
        <img
          src={props.image}
          alt={props.imageAltText}
          className="min-w-[200px] lg:min-w-[120px]"
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
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <div className="flex gap-32 items-center mb-48">
          <div>
            <Check />
          </div>
          <h1 className="text-30 leading-36 w-[24rem]">
            Ihre Grundsteuererklärung wurde erfolgreich versendet.
          </h1>
        </div>
      </ContentContainer>
      <ContentContainer size="lg">
        <DownloadCard image={erklaerungImage} imageAltText="">
          <h3 className="font-bold text-18 mb-8">
            Ihre Grundsteuererklärung als PDF
          </h3>
          <p className="mb-24">
            Hier finden Sie eine Zusammenfassung Ihrer Daten, die wir an ELSTER
            übermittelt haben. Das PDF enthält auch das Transferticket.
          </p>
          <Button
            target={"_blank"}
            download
            look="primary"
            iconRight={<Download />}
            className="mb-40"
            {...pdfButtonProps}
          >
            Erklärung als PDF herunterladen
          </Button>
          <Hint className="mb-0">
            Laden Sie sich das PDF für Ihre Unterlagen herunter. Zum Schutz
            Ihrer persönlichen Daten ist dies nur 24 Stunden möglich.
          </Hint>
        </DownloadCard>

        <DownloadCard image={transferticketImage} imageAltText="">
          <h3 className="font-bold text-18 mb-8">
            Transferticket: Beweis der Übermittlung an ELSTER
          </h3>
          <p className="mb-32">
            Notieren Sie sich die Zeichenkette oder laden Sie das Transferticket
            als Textdatei herunter. Bewahren Sie es gut auf.
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
            Laden Sie sich das Transferticket für Ihre Unterlagen herunter. Zum
            Schutz Ihrer persönlichen Daten ist dies nur 24 Stunden möglich.
          </Hint>
        </DownloadCard>

        <div className="bg-white p-32 mb-32">
          <ContentContainer size="sm">
            <h2 className="text-24 mb-16">Wie geht es jetzt weiter?</h2>
            <EnumeratedList
              items={[
                "Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet",
                <div>
                  Zwischen 2022 und 2024 bekommen Sie{" "}
                  <strong>drei Briefe</strong>:
                  <ul className="list-disc ml-20">
                    <li>Grundsteuerwertbescheid</li>
                    <li>Grundsteuermessbescheid</li>
                    <li>den neuen Grundsteuerbescheid</li>
                  </ul>
                </div>,
                "Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die neue Grundsteuer.",
              ]}
              className="mb-32"
            />
            <p className="font-bold">
              Ihr Nutzerkonto wird 7 Monate nach Absenden der Erklärung
              automatisch gelöscht.
            </p>
          </ContentContainer>
        </div>

        <div className="bg-white p-32 mb-32">
          <ContentContainer size="sm">
            <h2 className="text-30 mb-32 leading-36">
              Weitere Grundsteuererklärung abgeben
            </h2>
            <IntroText>
              Wenn Sie mögen, können Sie gleich eine weitere Erklärung starten —
              dafür müssen Sie sich nicht erneut identifizieren.
            </IntroText>
            <Button
              href="/formular/weitereErklaerung"
              iconRight={<Plus />}
              className="w-full"
            >
              Weitere Erklärung abgeben
            </Button>
          </ContentContainer>
        </div>
      </ContentContainer>
    </>
  );
}
