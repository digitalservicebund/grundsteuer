import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-flur.png";

const FlurHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn Sie ein Grundbuch haben, finden Sie die Angabe der Flur im Bestandsverzeichnis hinter der Gemarkung.",
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

export default FlurHelp;
