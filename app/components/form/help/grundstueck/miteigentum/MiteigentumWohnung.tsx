import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImgWohnung from "~/assets/images/help/miteigentum/eingabe-wohnung.png";

const MiteigentumWohnungHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Übertragen Sie den Wert so, wie Sie ihn vorfinden. Der Zähler steht vor dem Schrägstrich. Der Nenner dahinter.",
        },
        {
          type: "image",
          source: grundbuchImgWohnung,
          altText:
            "Bildbeispiel eines Grundbuchauszugs einer Eigentumswohnung mit dem hervorgehobenen Bruch zum Miteigentumsanteil",
        },
      ]}
    />
  );
};

export default MiteigentumWohnungHelp;
