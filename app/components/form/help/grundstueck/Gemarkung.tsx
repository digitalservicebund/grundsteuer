import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-gemarkung.png";

const GemarkungHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Die Gemarkung finden Sie im Bestands-verzeichnis vor der Angabe zu Flur und Flurstück.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem die Gemarkung hervorgehoben ist",
        },
      ]}
    />
  );
};

export default GemarkungHelp;
