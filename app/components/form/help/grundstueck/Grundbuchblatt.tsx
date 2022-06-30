import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-grundbuchblattnummer.png";

const GrundbuchblattHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn Sie ein Grundbuch haben, finden Sie die Nummer des Grundbuchblatts auf dem Deckblatt des Grundbuchauszugs oder auf den Innenseiten des Bestandsverzeichnis.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText:
            "Bildbeispiel eines Deckblatt eines Grundbuchauszugs in dem die Grundbuchblattnummer hervorgehoben ist",
        },
      ]}
    />
  );
};

export default GrundbuchblattHelp;
