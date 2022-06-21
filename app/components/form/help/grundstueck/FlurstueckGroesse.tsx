import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-flurstueck-groesse.png";

const FlurstueckGroesseHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn Sie ein Grundbuch haben, finden Sie die Angaben im Bestandsverzeichnis. Übertragen Sie die Zahlen in die Felder genau so, wie sie in Ihrem Grundbuch stehen.",
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

export default FlurstueckGroesseHelp;
