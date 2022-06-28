import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import bb from "~/assets/images/help/boris/eingabe-bb.png";
import be from "~/assets/images/help/boris/eingabe-be.png";
import hb from "~/assets/images/help/boris/eingabe-hb.png";
import mv from "~/assets/images/help/boris/eingabe-mv.png";

import { GrundModel } from "~/domain/steps";

const BBEingabeHelp: HelpComponentFunction = () => {
  return (
    <BundeslandEingabeHelp
      paragraph1="In der vorletzten Zeile der PDF mit Detailangaben zu Ihrem Flurstück, finden Sie den Bodenrichtwert."
      image={bb}
      altText="Beispiel PDF"
      paragraph2="Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung."
    />
  );
};

const BEEingabeHelp: HelpComponentFunction = () => {
  return (
    <BundeslandEingabeHelp
      paragraph1="Im Bodenrichtwert-Portal “BORIS Berlin” können Sie den Bodenrichtwert ablesen. Die obere, rot unterstrichene Zahl übertragen Sie in dieses Feld."
      image={be}
      altText="Screenshot vom Portal BORIS Berlin"
      paragraph2="Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung."
    />
  );
};

const HBEingabeHelp: HelpComponentFunction = () => {
  return (
    <BundeslandEingabeHelp
      paragraph1="Im Bodenrichtwert-Portal Bremen und Niedersachsen öffnet sich nach Adresseingabe ein Feld rechts neben dem Kartenausschnitt. Hier finden Sie in der ersten Zeile den Bodenrichtwert für Ihr Grundstück."
      image={hb}
      altText="Screenshot vom Bodenrichtwert-Portal Bremen und Niedersachsen"
      paragraph2="Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung."
    />
  );
};

const MVEingabeHelp: HelpComponentFunction = () => {
  return (
    <BundeslandEingabeHelp
      paragraph1="In dem PDF, dass Sie auf der externen Seite generieren konnten, finden Sie den Bodenrichtwert in Euro pro Quadratmeter."
      image={mv}
      altText="Beispiel PDF"
      paragraph2="Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung."
    />
  );
};

const RPEingabeHelp: HelpComponentFunction = () => {
  return (
    <BundeslandEingabeHelp
      paragraph1="Den Bodenrichtwert finden Sie im Datenblatt des Informationsschreibens der Finanzverwaltung."
      image={mv}
      altText="Beispiel Datenblatt des Informationsschreibens"
      paragraph2="Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung."
    />
  );
};

const BundeslandEingabeHelp = ({
  paragraph1,
  paragraph2,
  image,
  altText,
}: {
  paragraph1: string;
  paragraph2: string;
  image: string;
  altText: string;
}): JSX.Element => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value: paragraph1,
        },
        {
          type: "image",
          source: image,
          altText: altText,
        },
        {
          type: "paragraph",
          value: paragraph2,
        },
      ]}
    />
  );
};

export const BodenrichtwertEingabeHelp: HelpComponentFunction = ({
  allData,
}) => {
  switch ((allData as GrundModel)?.grundstueck?.adresse?.bundesland) {
    case "BB":
      return <BBEingabeHelp />;
    case "BE":
      return <BEEingabeHelp />;
    case "HB":
      return <HBEingabeHelp />;
    case "MV":
      return <MVEingabeHelp />;
    case "RP":
      return <RPEingabeHelp />;
    default:
      return <></>;
  }
};
