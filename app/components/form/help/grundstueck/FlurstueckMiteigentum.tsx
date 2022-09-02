import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/miteigentum/eingabe-flurstueck.png";

const FlurstueckMiteigentumHelp: HelpComponentFunction = () => {
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
          source: grundbuchImg,
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem der Miteigentumsanteil hervorgehoben ist",
        },
      ]}
    />
  );
};

export default FlurstueckMiteigentumHelp;
