import { MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import UebersichtStep from "~/components/form/UebersichtStep";
import erfolgImage from "~/assets/images/erfolg-phone.svg";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  SubHeadline,
} from "~/components";
import Check from "~/components/icons/mui/Check";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erklärung abgeschickt") };
};

export default function Erfolg() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <UebersichtStep imageSrc={erfolgImage} smallImageSrc={erfolgImage}>
        <div className="mb-80">
          <Check className="mb-48" />
          <Headline>
            Ihre Grundsteuererklärung wurde erfolgreich versendet.
          </Headline>
        </div>

        <h2 className="font-bold text-24">Wie geht es jetzt weiter?</h2>
        <p>
          Das Wichtigste: bis zum Jahr 2025 zahlen Sie noch die alte
          Grundsteuer.{" "}
        </p>
        <ul className="list-disc ml-20 mb-48">
          <li>Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet</li>
          <li>
            Zwischen 2022 und 2024 bekommen Sie <strong>drei Briefe</strong>:
            Grundsteuerwertbescheid, Grundsteuermessbescheid und den neuen
            Grundsteuerbescheid.
          </li>
          <li>Ab 2025 zahlen Sie die neue Grundsteuer.</li>
        </ul>

        <h2 className="font-bold text-24">Für Ihre Unterlagen</h2>
        <h3 className="text-24">Beweis der Übermittlung an ELSTER</h3>
        <p className="mb-48">
          Das so gennte Transferticket ist der Beweis, dass Ihre Erklärung an
          ELSTER erfolgreich übermittelt wurde. Bitte bewahren Sie es gut auf.{" "}
          <br />
          {">"} Hinweis: Sie können das Ticket nur jetzt herunterladen.
        </p>

        <h3 className="text-24">Ihre Grundsteuererklärung</h3>
        <p>
          Hier finden Sie Ihre Grundsteuererklärung als PDF. Wir haben Ihre
          Angaben für den Versand an ELSTER aufbereitet.
          <br />
          {">"} Hinweis: Sie können das PDF nur jetzt herunterladen.
        </p>
      </UebersichtStep>
    </ContentContainer>
  );
}
