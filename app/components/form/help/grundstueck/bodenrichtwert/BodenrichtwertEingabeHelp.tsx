import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import bb from "~/assets/images/help/boris/eingabe-bb.png";
import be from "~/assets/images/help/boris/eingabe-be.png";
import hb from "~/assets/images/help/boris/eingabe-hb.png";
import mv from "~/assets/images/help/boris/eingabe-mv.png";
import rp from "~/assets/images/help/boris/eingabe-rp.png";
import sh from "~/assets/images/help/boris/eingabe-sh.png";
import sl from "~/assets/images/help/boris/eingabe-sl.png";
import mehrereWerte from "~/assets/images/help/boris/eingabe-mehrere-werte.png";

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
          altText:
            "Bildbeispiel für eine PDF mit Grundstücksdaten des Bodenrichtwertportal Brandenburg",
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
          altText:
            "Kartenausschnitt des Bodenrichtwertportal Berlin mit einem Bodenrichtwert für ein markiertes Grundstück",
        },
        {
          type: "paragraph",
          value:
            "Es ist möglich, dass in einer Bodenrichtwertzone mehrere Werte angeben werden. Jeder Wert steht dann für eine andere Art der Nutzung (zum Beispiel Mehrfamilienhaus oder Gewerbefläche). Prüfen Sie, welche Art der Nutzung auf Ihr Grundstück zutrifft und tragen Sie den entsprechenden Wert ein.",
        },
        {
          type: "image",
          source: mehrereWerte,
          altText:
            "Bildbeispiel für eine Bodenrichtwertzone mit mehreren Werten",
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
            "Bildbeispiel für einen Bodenrichtwert des Bodenrichtwertportal Bremen und Niedersachsen",
        },
        {
          type: "paragraph",
          value:
            "Es ist möglich, dass in einer Bodenrichtwertzone mehrere Werte angeben werden. Jeder Wert steht dann für eine andere Art der Nutzung (zum Beispiel Mehrfamilienhaus oder Gewerbefläche). Prüfen Sie, welche Art der Nutzung auf Ihr Grundstück zutrifft und tragen Sie den entsprechenden Wert ein.",
        },
        {
          type: "image",
          source: mehrereWerte,
          altText:
            "Bildbeispiel für eine Bodenrichtwertzone mit mehreren Werten",
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
          altText:
            "Bildbeispiel für einen Bodenrichtwert im Datenstammblatt Mecklenburg-Vorpommern",
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
            "Den Bodenrichtwert finden Sie im Datenblatt des Informationsschreibens der Finanzverwaltung.",
        },
        {
          type: "image",
          source: rp,
          altText:
            "Bildbeispiel für einen Bodenrichtwert im Datenstammblatt Rheinland-Pfalz",
        },
      ]}
    />
  );
};

const SHEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Auf der externen Seite, habe Sie nach Eingabe der Adresse des Grundstücks einen vergrößerten Kartenausschnitt mit dazugehörigen Daten erhalten. Hier können Sie den Bodenrichtwert ablesen.",
        },
        {
          type: "image",
          source: sh,
          altText:
            "Bildbeispiel für einen Bodenrichtwert im Bodenrichtwertportal Schleswig-Holstein",
        },
        {
          type: "paragraph",
          value:
            "Es ist möglich, dass in einer Bodenrichtwertzone mehrere Werte angeben werden. Jeder Wert steht dann für eine andere Art der Nutzung (zum Beispiel Mehrfamilienhaus oder Gewerbefläche). Prüfen Sie, welche Art der Nutzung auf Ihr Grundstück zutrifft und tragen Sie den entsprechenden Wert ein.",
        },
        {
          type: "image",
          source: mehrereWerte,
          altText:
            "Bildbeispiel für eine Bodenrichtwertzone mit mehreren Werten",
        },
      ]}
    />
  );
};

const SLEingabeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Auf dem Bodenrichtwertportal Saarland, haben Sie nach Eingabe der Adresse des Grundstücks einen vergrößerten Kartenausschnitt mit dazugehörigen Daten erhalten. Hier können Sie den Bodenrichtwert ablesen.",
        },
        {
          type: "image",
          source: sl,
          altText:
            "Alt Text: Bildbeispiel für einen Bodenrichtwert im Datenstammblatt Saarland",
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
    case "SH":
      return <SHEingabeHelp />;
    case "SL":
      return <SLEingabeHelp />;
    default:
      return <></>;
  }
};
