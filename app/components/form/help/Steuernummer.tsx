import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import sonderzeichenImg from "~/assets/images/help-steuernummer-sonderzeichen.png";
import infoschreibenImg from "~/assets/images/help-steuernummer-infoschreiben.png";

const SteuernummerHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Bitte tragen Sie das Aktenzeichen / die Steuernummer ohne Sonderzeichen ein.",
        },
        {
          type: "image",
          source: sonderzeichenImg,
          altText: "Beispiel Sonderzeichen entfernen",
        },
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
