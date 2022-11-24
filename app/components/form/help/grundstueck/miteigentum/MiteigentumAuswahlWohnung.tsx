import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImgNone from "~/assets/images/help/miteigentum/auswahl-wohnung-none.png";
import grundbuchImgGarage1 from "~/assets/images/help/miteigentum/auswahl-wohnung-garage-1.png";
import grundbuchImgGarage2 from "~/assets/images/help/miteigentum/auswahl-wohnung-garage-2.png";
import grundbuchImgSondernutzung from "~/assets/images/help/miteigentum/auswahl-wohnung-sondernutzung.png";
import grundbuchImgMixed from "~/assets/images/help/miteigentum/auswahl-wohnung-mixed.png";

export const MiteigentumAuswahlWohnungNoneHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Sie haben nur einen Grundbuchauszug vorliegen in dem Sie nur genau einen Miteigentumsanteil finden.",
        },
        {
          type: "image",
          source: grundbuchImgNone,
          altText:
            "Bildbeispiel eines Grundbuchauszugs mit genau einmal dem Wort Miteigentumsanteil",
        },
      ]}
    />
  );
};

export const MiteigentumAuswahlWohnungGarageHelp: HelpComponentFunction =
  () => {
    return (
      <DefaultHelpContent
        elements={[
          {
            type: "paragraph",
            value:
              "Wählen Sie diese Option, wenn Sie neben Ihrer Eigentumswohnung einen Garagen- oder Tiefgaragenstellplatz besitzen. In der Regel gibt es für Wohnung und Garage separate Grundbuchauszüge.",
          },
          {
            type: "image",
            source: grundbuchImgGarage1,
            altText:
              "Bildbeispiel eines Grundbuchauszugs einer Eigentumswohnung mit dem hervorgehobenen Wort Miteigentumsanteil",
          },
          {
            type: "image",
            source: grundbuchImgGarage2,
            altText:
              "Bildbeispiel eines Grundbuchauszugs eines Garagen- oder Tiefgaragenstellplatzes mit dem hervorgehobenen Wort Miteigentumsanteil",
          },
        ]}
      />
    );
  };

export const MiteigentumAuswahlWohnungSondernutzungHelp: HelpComponentFunction =
  () => {
    return (
      <DefaultHelpContent
        elements={[
          {
            type: "paragraph",
            value:
              "Sie haben eine Eigentumswohnung. An einer Garage oder anderen Fläche haben Sie Sondernutzungsrechte.",
          },
          {
            type: "image",
            source: grundbuchImgSondernutzung,
            altText:
              "Bildbeispiel eines Grundbuchauszugs einer Eigentumswohnung mit einem Miteigentumsanteil und dem hervorgehobenen Wort Sondernutzungsrecht",
          },
        ]}
      />
    );
  };

export const MiteigentumAuswahlWohnungMixedHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Ich besitze neben meiner Eigentumswohnung unterschiedliche Miteigentumsanteile beispielsweise an: einem Spielplatz, einem Privatweg/Anliegerstraße, einer Gemeinschaftsfläche, einem Gemeinschaftsgarten, einer Verkehrsfläche oder einem Parkplatz.",
        },
        {
          type: "image",
          source: grundbuchImgMixed,
          altText:
            "Bildbeispiel eines Grundbuchauszugs mit mehrfach dem Wort Miteigentumsanteil mit unterschiedlichen Beträgen",
        },
      ]}
    />
  );
};
