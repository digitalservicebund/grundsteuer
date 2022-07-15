import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import steuerIdImg from "~/assets/images/help/help-steuer-id.png";

const SteuerIdHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Bei der Steuer-Identifikationsnummer handelt es sich nicht um die Steuernummer Ihres Grundstücks. Sie finden die Steuer-Identifikationsnummer zum Beispiel auf Ihrem letzten Einkommensteuerbescheid oder suchen Sie in Ihren Unterlagen nach einem Brief vom Bundeszentralamt für Steuern. Die 11-stellige Nummer steht oben rechts groß auf dem Brief.",
        },
        {
          type: "image",
          source: steuerIdImg,
          altText:
            "Abbildung des Briefes des Bundeszentralamtes mit der Steuer-Identifikationsnummer",
        },
      ]}
    />
  );
};

export default SteuerIdHelp;
