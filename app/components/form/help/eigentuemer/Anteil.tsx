import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-eigentuemer-anteil.png";

const AnteilHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Für andere Anteile benutzen Sie das Textfeld und tragen Sie Ihren Eigentumsanteil mit einem Schrägstrich als Trennung ein.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText: "Beispiel Grundbuch",
        },
      ]}
    />
  );
};

export default AnteilHelp;
