import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-flurstueck-fraction.png";

const FlurstueckZaehlerHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn Sie ein Grundbuch haben, finden Sie die Angabe unter der Bezeichnung Flurstück. Die Angabe wird meist durch einen Schrägstrich oder Bruchstrich visualisiert. Haben sie nur eine Angabe unter Flurstück, tragen Sie nur diese ein.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText: "Beispiel Grundbuch Bestandsverzeichnis",
        },
      ]}
    />
  );
};

export default FlurstueckZaehlerHelp;
