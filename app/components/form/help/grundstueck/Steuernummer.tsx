import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import infoschreibenImg from "~/assets/images/help/help-steuernummer-infoschreiben.png";

const SteuernummerHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "list",
          intro:
            "Sie finden das Aktenzeichen / die Steuernummer in der Regel auf dem:",
          items: [
            "Informationsschreiben Ihrer Landesfinanzverwaltung",
            "Einheitswertbescheid",
            "Bescheid zur Festsetzung des Grundsteuermessbetrags",
            "Grundsteuerbescheid",
          ],
        },
        {
          type: "image",
          source: infoschreibenImg,
          altText: "Beispiel Infoschreiben",
        },
      ]}
    />
  );
};

export default SteuernummerHelp;
