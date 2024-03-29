import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-eigentuemer-anzahl.png";

const EigentuemerAnzahlHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Die Angabe über die Anzahl der Eigentümer:innen können Sie dem Grundbuch entnehmen.",
        },
        {
          type: "image",
          source: grundbuchImg,
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem die Anteile der Eigentümer und Eigentümerinnen hervorgehoben ist",
        },
      ]}
    />
  );
};

export default EigentuemerAnzahlHelp;
