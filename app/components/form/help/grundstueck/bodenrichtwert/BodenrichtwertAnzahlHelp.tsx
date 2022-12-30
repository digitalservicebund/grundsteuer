import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import image11 from "~/assets/images/help/help-bodenrichtwert-anzahl-1-1.png";
import image12 from "~/assets/images/help/help-bodenrichtwert-anzahl-1-2.png";
import image21 from "~/assets/images/help/help-bodenrichtwert-anzahl-2-1.png";

export const BodenrichtwertAnzahl1Help: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn alle Teile Ihres Grundstücks einen Bodenrichtwert haben, wählen Sie diese Option aus.",
        },
        {
          type: "image",
          source: image11,
          altText: "",
        },
        {
          type: "paragraph",
          value:
            "Manche Bodenrichtwertportale bieten verschiedene „Arten der Nutzung“ an. Zum Beispiel Mehrfamilienhaus, Gewerbefläche oder Freizeitfläche). Bestimmen Sie die entsprechende Art der Nutzung für Ihr Grundstück. Diese entspricht nur einem Bodenrichtwert.",
        },
        {
          type: "image",
          source: image12,
          altText: "",
        },
      ]}
    />
  );
};
export const BodenrichtwertAnzahl2Help: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Wenn Ihr Grundstück zwei oder mehr verschiedene Bodenrichtwerte hat, wählen Sie diese Option aus.",
        },
        {
          type: "image",
          source: image21,
          altText: "",
        },
        {
          type: "paragraph",
          value:
            "Manche Bodenrichtwertportale bieten verschiedene „Arten der Nutzung“ an. Zum Beispiel Mehrfamilienhaus, Gewerbefläche oder Freizeitfläche). Bestimmen Sie die entsprechende Art der Nutzung für Ihr Grundstück. Diese entspricht nur einem Bodenrichtwert.",
        },
        {
          type: "image",
          source: image12,
          altText: "",
        },
      ]}
    />
  );
};
