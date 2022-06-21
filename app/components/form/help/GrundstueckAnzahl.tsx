import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import grundbuchImg from "~/assets/images/help/help-flurstueck-anzahl.png";

const GrundstueckAnzahlHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "image",
          source: grundbuchImg,
          altText: "Beispiel Grundbuch Bestandsverzeichnis",
        },
      ]}
    />
  );
};

export default GrundstueckAnzahlHelp;
