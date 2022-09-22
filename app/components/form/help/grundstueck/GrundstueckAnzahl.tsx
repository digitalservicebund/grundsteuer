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
          altText:
            "Bildbeispiel eines Grundbuchauszug in dem Flurstücke hervorgehoben sind",
        },
      ]}
    />
  );
};

export default GrundstueckAnzahlHelp;
