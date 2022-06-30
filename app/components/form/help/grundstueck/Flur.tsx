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
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem die Flurnummer hervorgehoben ist",
        },
      ]}
    />
  );
};

export default FlurHelp;
