import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-miteigentum.png";

const FlurstueckMiteigentumHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Übertragen Sie wieder die Werte vor und nach dem Schrägstrich (wenn vorhanden) in jeweils eines der Felder.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem der Miteigentumsanteil hervorgehoben ist",
        },
      ]}
    />
  );
};

export default FlurstueckMiteigentumHelp;
