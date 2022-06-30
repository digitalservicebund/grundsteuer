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
            "Wenn Sie ein Grundbuch haben, finden Sie die Gemarkung im Bestandsverzeichnis vor der Angabe zu Flur und Flurstück.",
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
