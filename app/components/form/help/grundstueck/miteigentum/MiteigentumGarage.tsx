import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImgGarage2 from "~/assets/images/help/miteigentum/auswahl-wohnung-garage-2.png";

const MiteigentumGarageHelp: HelpComponentFunction = () => {
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
          source: grundbuchImgGarage2,
          altText:
            "Bildbeispiel eines Grundbuchauszugs eines Garagen- oder Tiefgaragenstellplatzes mit dem hervorgehobenen Wort Miteigentumsanteil",
        },
      ]}
    />
  );
};

export default MiteigentumGarageHelp;
