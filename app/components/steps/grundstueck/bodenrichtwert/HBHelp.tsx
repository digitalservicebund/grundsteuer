import EnumeratedCard from "~/components/EnumeratedCard";
import hb1 from "~/assets/images/boris/info-hb-1.png";
import hb2 from "~/assets/images/boris/info-hb-2.png";
import hb3 from "~/assets/images/boris/info-hb-3.png";

export const HBHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={hb1}
          imageAltText="Kartenausschnitt von Schritt 1 Bodenrichtwert-Portal Bremen und Niedersachsen"
          number="1"
          heading="Bodenrichtwert-Portal Bremen und Niedersachsen öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Auf der Seite finden Sie oben eine Suchleiste. Geben Sie dort Ihre Adresse ein. "
          className="mb-16"
        />
        <EnumeratedCard
          image={hb2}
          imageAltText="Kartenausschnitt von Schritt 2 Bodenrichtwert-Portal Bremen und Niedersachsen"
          number="2"
          heading="Bodenrichtwert ablesen"
          text="Der Kartenausschnitt zeigt nun Ihr Grundstück und markiert die Stelle mit einem roten Symbol. Rechts öffnet sich ein Bereich mit Informationen. Merken Sie sich den Wert von “Bodenrichtwert” für die Eingabe."
          className="mb-16"
        />
        <EnumeratedCard
          image={hb3}
          imageAltText="Kartenausschnitt von Schritt 3 Bodenrichtwert-Portal Bremen und Niedersachsen"
          number="3"
          heading="Sie sehen mehrere Bodenrichtwerte?"
          text="Vergleichen Sie in diesem Fall die Zeilen “Art der Nutzung” und wählen Sie dann den Bodenrichtwert jener Zone, die auf Ihren Grundstückstyp zutrifft.
Hinweis: Bei Eigentumswohnungen, trifft die Nutzung für Mehrfamilienhäuser zu.&#13;  Merken Sie sich den Bodenrichtwert für die Eingabe. Dieser ist nicht umzurechnen (die angezeigte Umrechnungsdatei ist nicht zu beachten)."
          className="mb-16"
        />
      </div>
    </>
  );
};
