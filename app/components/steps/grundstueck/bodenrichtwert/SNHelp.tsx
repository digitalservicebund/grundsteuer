import EnumeratedCard from "~/components/EnumeratedCard";
import sn1 from "~/assets/images/boris/info-sn-1.png";
import sn2 from "~/assets/images/boris/info-sn-2.png";
import sn3 from "~/assets/images/boris/info-sn-3.png";
import sn4 from "~/assets/images/boris/info-sn-4.png";

export const SNHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={sn1}
          imageAltText="Kartenausschnitt von Schritt 1 des Grundsteuerportal Sachsen"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Auf der Seite finden Sie eine Suchleiste oben links. Geben Sie dort die Adresse Ihres Grundstücks ein."
          className="mb-16"
        />
        <EnumeratedCard
          image={sn2}
          imageAltText="Kartenausschnitt von Schritt 2 des Grundsteuerportal Sachsen"
          number="2"
          heading="Karte öffnet sich"
          text="Auf einem Kartenausschnitt wird Ihre eingegebene Adresse mit einem blauen Plus-Symbol markiert. Die Markierung befindet sich innerhalb einer rot umrandeten Fläche. Das ist die Bodenrichtwertzone. Klicken Sie auf das Plus-Symbol um den Bodenrichtwert zu ermitteln."
          className="mb-16"
        />
        <EnumeratedCard
          image={sn3}
          imageAltText="Kartenausschnitt von Schritt 3 des Grundsteuerportal Sachsen"
          number="3"
          heading="Informationsfenster und Bodenrichtwert"
          text="Es öffnet sich ein Informationsfenster aus dem Sie Daten zu Ihrem Grundstück ablesen können. Scrollen Sie in dem Fenster nach unten. Ihnen werden unter Umständen mehrere Bodenrichtwerte angezeigt."
          className="mb-16"
        />
        <EnumeratedCard
          image={sn4}
          imageAltText="Kartenausschnitt von Schritt 4 des Grundsteuerportal Sachsen"
          number="4"
          heading="Sie sehen mehrere Bodenrichtwerte?"
          text="Vergleichen Sie in diesem Fall die Zeilen “Art der Nutzung” und wählen Sie dann den Bodenrichtwert jener Zone, die auf Ihren Grundstückstyp zutrifft. "
          className="mb-16"
        />
      </div>
    </>
  );
};
