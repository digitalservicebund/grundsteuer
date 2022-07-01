import EnumeratedCard from "~/components/EnumeratedCard";
import th1 from "~/assets/images/boris/info-th-1.png";
import th2 from "~/assets/images/boris/info-th-2.png";
import th3 from "~/assets/images/boris/info-th-3.png";
import th4 from "~/assets/images/boris/info-th-4.png";

export const THHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={th1}
          imageAltText="Kartenausschnitt von Schritt 1 des Grundsteuer Viewers Thüringen"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Im oberen rechten Bereich können Sie in der Freitext-Suche Ihre Adresse eingeben. Alternativ gibt es die Möglichkeit über die Suche oben links nach Flurstücken zu suchen."
          className="mb-16"
        />
        <EnumeratedCard
          image={th2}
          imageAltText="Kartenausschnitt von Schritt 2 des Grundsteuer Viewers Thüringen"
          number="2"
          heading="Kartenausschnitt"
          text="Nach der Eingabe werden Ihnen ein oder mehrere Ergebnisse vorgeschlagen. Wählen Sie Ihre Grundstücksadresse aus. Ihr Grundstück wird nun mit einem roten Symbol im Kartenausschnitt markiert. Klicken Sie auf das Symbol für Detailinformationen."
          className="mb-16"
        />
        <EnumeratedCard
          image={th3}
          imageAltText="Kartenausschnitt von Schritt 3 des Grundsteuer Viewers Thüringen"
          number="3"
          heading="Fenster Detailinformationen"
          text="Es öffnet sich ein Fenster mit Informationen zu Ihrem Grundstück. Den Bodenrichtwert finden sie weiter unten."
          className="mb-16"
        />
        <EnumeratedCard
          image={th4}
          imageAltText="Kartenausschnitt von Schritt 4 des Grundsteuer Viewers Thüringen"
          number="4"
          heading="Bodenrichtwert ablesen"
          text="Wählen Sie hier die Nutzungsart aus, die auf Ihr Wohneigentum zutrifft. Merken Sie sich den Wert für die Eingabe. Wenn es mehrere Werte für eine Nutzungsart gibt, merken Sie sich den höheren Wert. Auch Informationen zu Gemarkung, Flur und Flurstück sind später noch relevant."
          className="mb-16"
        />
      </div>
    </>
  );
};
