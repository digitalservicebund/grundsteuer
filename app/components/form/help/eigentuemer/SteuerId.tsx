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
            "Bei der Steuer-Identifikationsnummer handelt es sich nicht um die Steuernummer Ihres Grundstücks.",
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
