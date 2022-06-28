import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import bb from "~/assets/images/help/boris/eingabe-bb.png";
import be from "~/assets/images/help/boris/eingabe-be.png";
import hb from "~/assets/images/help/boris/eingabe-hb.png";
import mv from "~/assets/images/help/boris/eingabe-mv.png";
import rp from "~/assets/images/help/boris/eingabe-rp.png";

import { GrundModel } from "~/domain/steps";

const BBEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "In der vorletzten Zeile der PDF mit Detailangaben zu Ihrem Flurstück, finden Sie den Bodenrichtwert.",
        },
        {
          type: "image",
          source: bb,
          altText: "Beispiel PDF",
        },
        {
          type: "paragraph",
          value:
            "Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung.",
        },
      ]}
    />
  );
};

const BEEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Im Bodenrichtwert-Portal “BORIS Berlin” können Sie den Bodenrichtwert ablesen. Die obere, rot unterstrichene Zahl übertragen Sie in dieses Feld.",
        },
        {
          type: "image",
          source: be,
          altText: "Screenshot vom Portal BORIS Berlin",
        },
        {
          type: "paragraph",
          value:
            "Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung.",
        },
      ]}
    />
  );
};

const HBEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Im Bodenrichtwert-Portal Bremen und Niedersachsen öffnet sich nach Adresseingabe ein Feld rechts neben dem Kartenausschnitt. Hier finden Sie in der ersten Zeile den Bodenrichtwert für Ihr Grundstück.",
        },
        {
          type: "image",
          source: hb,
          altText:
            "Screenshot vom Bodenrichtwert-Portal Bremen und Niedersachsen",
        },
        {
          type: "paragraph",
          value:
            "Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung.",
        },
      ]}
    />
  );
};

const MVEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "In dem PDF, dass Sie auf der externen Seite generieren konnten, finden Sie den Bodenrichtwert in Euro pro Quadratmeter.",
        },
        {
          type: "image",
          source: mv,
          altText: "Beispiel PDF",
        },
        {
          type: "paragraph",
          value:
            "Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung.",
        },
      ]}
    />
  );
};

const RPEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Im Bodenrichtwert-Portal Bremen und Niedersachsen öffnet sich nach Adresseingabe ein Feld rechts neben dem Kartenausschnitt. Hier finden Sie in der ersten Zeile den Bodenrichtwert für Ihr Grundstück.",
        },
        {
          type: "image",
          source: rp,
          altText:
            "Screenshot vom Bodenrichtwert-Portal Bremen und Niedersachsen",
        },
        {
          type: "paragraph",
          value:
            "Konnten Sie die Eingaben nicht finden? Dann gehen Sie zurück auf die Seite Bodenrichtwert-Info und befolgen Sie unsere Schritt-für-Schritt Anleitung.",
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
