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
            "Sie finden diese Angabe in Ihrem Grundbuchauszug im Bereich Eigentümer oder in der Teilungserklärung.",
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
