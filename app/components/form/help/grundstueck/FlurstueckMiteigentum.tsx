import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/miteigentum/eingabe.png";

const MiteigentumHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Übertragen Sie die Werte. Der Zähler steht vor dem Schrägstrich. Der Nenner steht hinter dem Schrägstrich. ",
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

export default MiteigentumHelp;
