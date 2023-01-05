import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import image from "~/assets/images/help/boris/eingabe-mehrere-werte.png";

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
          type: "paragraph",
          value:
            "Manche Bodenrichtwertportale bieten verschiedene “Art der Nutzung” an. Zum Beispiel Mehrfamilienhaus, Gewerbefläche oder Freizeitfläche. Bestimmen Sie die entsprechende Art der Nutzung, die auf Ihr Grundstück zutrifft. Wenn Ihr Grundstück mehrere Arten der Nutzung hat, vermerken Sie dies im Freitextfeld am Ende der Formularseiten.",
        },
        {
          type: "image",
          source: image,
          altText: "Bildbeispiel für verschiedene Arten der Nutzung",
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
            "Wenn Ihr Grundstück zwei oder mehrere verschiedene Bodenrichtwerte hat, wählen Sie diese Option aus. Dies ist der Fall, wenn durch alle Flurstücke, die zu einem Grundstück gehören, eine Bodenrichtwertgrenze verläuft.",
        },
        {
          type: "paragraph",
          value:
            "Manche Bodenrichtwertportale bieten verschiedene “Art der Nutzung” an. Zum Beispiel Mehrfamilienhaus, Gewerbefläche oder Freizeitfläche. Bestimmen Sie die entsprechende Art der Nutzung, die auf Ihr Grundstück zutrifft.\n" +
            "Wenn Ihr Grundstück mehrere Arten der Nutzung hat, vermerken Sie dies im Freitextfeld am Ende der Formularseiten.",
        },
        {
          type: "image",
          source: image,
          altText: "Bildbeispiel für verschiedene Arten der Nutzung",
        },
      ]}
    />
  );
};
