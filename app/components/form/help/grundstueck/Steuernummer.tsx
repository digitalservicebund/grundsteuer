import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import imgBe from "~/assets/images/help/steuernummer/help-steuernummer-be.png";
import imgHb from "~/assets/images/help/steuernummer/help-steuernummer-hb.png";
import imgDefault from "~/assets/images/help/steuernummer/help-steuernummer-default.png";
import imgNw from "~/assets/images/help/steuernummer/help-steuernummer-nw.png";
import imgSh from "~/assets/images/help/steuernummer/help-steuernummer-sh.png";

import { GrundModel } from "~/domain/steps/index.server";

const SteuernummerHelp: HelpComponentFunction = ({ allData }) => {
  const bundesland = (allData as GrundModel)?.grundstueck?.adresse?.bundesland;

  switch (bundesland) {
    case "BE":
      return (
        <DefaultHelpContent
          elements={[
            {
              type: "list",
              intro:
                "Sie finden die Steuernummer des Grundstücks in der Regel auf dem:",
              items: [
                "Einheitswertbescheid",
                "Bescheid zur Festsetzung des Grundsteuermessbetrags",
                "Grundsteuerbescheid",
              ],
            },
            {
              type: "image",
              source: imgBe,
              altText:
                "Bildbeispiel für einen Grundsteuerbescheid mit der Steuernummer eines Grundstücks",
            },
          ]}
        />
      );

    case "HB":
      return (
        <DefaultHelpContent
          elements={[
            {
              type: "list",
              intro:
                "Sie finden die Steuernummer des Grundstücks in der Regel auf dem:",
              items: [
                "Informationsschreiben der Landesfinanzverwaltung",
                "Einheitswertbescheid",
                "Grundsteuerbescheid, sofern sich Ihr Grundstück in der Stadtgemeinde Bremen befindet.",
              ],
            },
            {
              type: "image",
              source: imgHb,
              altText:
                "Bildbeispiel für ein Informationsschreiben mit der Steuernummer eines Grundstücks",
            },
          ]}
        />
      );

    case "NW":
      return (
        <DefaultHelpContent
          elements={[
            {
              type: "list",
              intro:
                "Sie finden das Aktenzeichen des Grundstücks in der Regel auf dem:",
              items: [
                "Informationsschreiben von Ihrer Landesfinanzverwaltung",
                "Grundsteuerbescheid",
                "Einheitswertbescheid",
                "Bescheid zur Festsetzung des Grundsteuermessbetrags",
              ],
            },
            {
              type: "image",
              source: imgNw,
              altText:
                "Bildbeispiel für ein Informationsschreiben mit dem Aktenzeichen eines Grundstücks",
            },
          ]}
        />
      );

    case "SH":
      return (
        <DefaultHelpContent
          elements={[
            {
              type: "list",
              intro:
                "Sie finden die Steuernummer des Grundstücks in der Regel auf dem:",
              items: [
                "Informationsschreiben von dem Land Schleswig-Holstein",
                "Grundsteuerbescheid oder Einheitswertbescheid",
                "Bescheid zur Festsetzung des Grundsteuermessbetrags",
              ],
            },
            {
              type: "image",
              source: imgSh,
              altText:
                "Bildbeispiel für ein Informationsschreiben mit der Steuernummer eines Grundstücks",
            },
          ]}
        />
      );

    default:
      return (
        <DefaultHelpContent
          elements={[
            {
              type: "list",
              intro:
                "Sie finden das Aktenzeichen des Grundstücks in der Regel auf dem:",
              items: [
                "Informationsschreiben Ihrer Landesfinanzverwaltung",
                "Grundsteuerbescheid",
                "Einheitswertbescheid",
                "Bescheid zur Festsetzung des Grundsteuermessbetrags",
              ],
            },
            {
              type: "image",
              source: imgDefault,
              altText:
                "Bildbeispiel für ein Informationsschreiben mit dem Aktenzeichen eines Grundstücks",
            },
          ]}
        />
      );
  }
};

export default SteuernummerHelp;
