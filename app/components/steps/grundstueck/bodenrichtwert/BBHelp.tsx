import EnumeratedCard from "~/components/EnumeratedCard";
import bb1 from "~/assets/images/boris/info-bb-1.png";
import bb2 from "~/assets/images/boris/info-bb-2.png";
import bb3 from "~/assets/images/boris/info-bb-3.png";
import bb4 from "~/assets/images/boris/info-bb-4.png";

export const BBHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={bb1}
          imageAltText="Kartenausschnitt von Schritt 1 Bodenrichtwert-Portal Brandenburg"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Auf der Seite geben Sie oben in der Suchleiste Ihre Adresse ein. Alternativ können Sie auch die Bezeichnung des Flurstücks eintragen (Zum Beispiel Flurstück 123 Flur 1 Gemarkung Musterhausen)."
          className="mb-16"
        />
        <EnumeratedCard
          image={bb2}
          imageAltText="Kartenausschnitt von Schritt 2 Bodenrichtwert-Portal Brandenburg"
          number="2"
          heading="Adresse / Flurstück im Kartenausschnitt finden"
          text="Der Kartenausschnitt zeigt nun Ihr Grundstück und markiert die Stelle mit einem blauen Symbol. Klicken Sie auf dieses Symbol. Im oberen rechten Bereich, öffnet sich ein weißes Fenster (Detailinformationen)."
          className="mb-16"
        />
        <EnumeratedCard
          image={bb3}
          imageAltText="Kartenausschnitt von Schritt 3 Bodenrichtwert-Portal Brandenburg"
          number="3"
          heading="Link zu PDF finden"
          text="In dem geöffneten Fenster finden Sie Informationen zum ausgewählten Flurstück mit Adresse. Bitte vergewissern Sie sich, dass Sie das richtige Flurstück ausgewählt haben und klicken Sie auf den blau unterstrichenen „Link zur Anzeige Grundsteuer-Informationen (BRW + EMZ)“."
          className="mb-16"
        />
        <EnumeratedCard
          image={bb4}
          imageAltText="Kartenausschnitt von Schritt 4 Bodenrichtwert-Portal Brandenburg"
          number="4"
          heading="Bodenrichtwert dem PDF entnehmen"
          text="Es öffnet sich eine PDF Detailinformation. In der vorletzten Zeile finden Sie den Punkt „Bodenrichtwert“. Das ist Ihr Bodenrichtwert in Euro pro Quadratmeter. Merken Sie sich diesen Wert für die Eingabe. Sie können das Informationsportal Grundstücksdaten nun verlassen."
          className="mb-16"
        />
      </div>
    </>
  );
};
