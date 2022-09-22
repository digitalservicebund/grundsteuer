import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImgFalse from "~/assets/images/help/miteigentum/auswahl-haus-false.png";
import grundbuchImgTrue1 from "~/assets/images/help/miteigentum/auswahl-haus-true-1.png";
import grundbuchImgTrue2 from "~/assets/images/help/miteigentum/auswahl-haus-true-2.png";

export const MiteigentumAuswahlHausFalseHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Miteigentumsanteile sind im Grundbuchauszug vermerkt. Entweder auf einer separaten Seite oder gebündelt mit den anderen Flurstücken. In der Regel steht bei den Anteilen das Wort “Miteigentum” dabei.",
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

export const MiteigentumAuswahlHausTrueHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Miteigentumsanteile sind im Grundbuchauszug vermerkt. Entweder auf einer separaten Seite oder gebündelt mit den anderen Flurstücken. In der Regel steht bei den Anteilen das Wort “Miteigentum” dabei.",
        },
        {
          type: "image",
          source: grundbuchImgTrue1,
          altText:
            "Bildbeispiel eines Grundbuchauszugs mit dem hervorgehobenen Wort Miteigentumsanteil",
        },
        {
          type: "image",
          source: grundbuchImgTrue2,
          altText:
            "Bildbeispiel eines Grundbuchauszugs mit dem mehrfach hervorgehobenen Wort Miteigentumsanteil",
        },
      ]}
    />
  );
};
