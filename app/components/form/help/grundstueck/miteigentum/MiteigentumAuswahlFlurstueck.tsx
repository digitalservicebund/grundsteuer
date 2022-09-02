import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImgFalse from "~/assets/images/help/miteigentum/auswahl-flurstueck-false.png";
import grundbuchImgTrue from "~/assets/images/help/miteigentum/eingabe-flurstueck.png";

export const MiteigentumAuswahlFlurstueckTrueHelp: HelpComponentFunction =
  () => {
    return (
      <DefaultHelpContent
        elements={[
          {
            type: "paragraph",
            value:
              "Miteigentumsanteile sind im Grundbuchauszug vermerkt. Entweder auf einer separaten Seite oder zusammen mit den anderen Grundstücksflächen auf einer Seite.",
          },
          {
            type: "image",
            source: grundbuchImgTrue,
            altText:
              "Bildbeispiel eines Grundbuchauszugs mit dem hervorgehobenen Wort Miteigentumsanteil",
          },
        ]}
      />
    );
  };

export const MiteigentumAuswahlFlurstueckFalseHelp: HelpComponentFunction =
  () => {
    return (
      <DefaultHelpContent
        elements={[
          {
            type: "paragraph",
            value:
              "Miteigentumsanteile sind im Grundbuchauszug vermerkt. Entweder auf einer eigenen Seite oder zusammen mit den anderen Grundstücksflächen. In der Regel steht bei den Anteilen das Wort “Miteigentum” dabei.",
          },
          {
            type: "image",
            source: grundbuchImgFalse,
            altText:
              "Bildbeispiel eines Grundbuchauszugs mit dem Wort Miteigentumsanteil",
          },
        ]}
      />
    );
  };
