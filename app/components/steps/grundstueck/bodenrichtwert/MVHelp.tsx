import EnumeratedCard from "~/components/EnumeratedCard";
import mv1 from "~/assets/images/boris/info-mv-1.png";
import mv2 from "~/assets/images/boris/info-mv-2.png";
import mv3 from "~/assets/images/boris/info-mv-3.png";
import mv4 from "~/assets/images/boris/info-mv-4.png";
import mv5 from "~/assets/images/boris/info-mv-5.png";

export const MVHelp = () => {
  return (
    <>
      <EnumeratedCard
        image={mv1}
        imageAltText="Bildbeispiel von Schritt 1 des Grundsteuerdaten-Portals Mecklenburg-Vorpommern"
        number="1"
        heading="Externe Seite öffnen und Adresse eingeben"
        text="Öffnen Sie den oben stehenden Link. Scrollen Sie ein Stück nach unten, bis Sie einen Kartenausschnitt sehen. Dort geben Sie in die Suchleiste Ihre Grundstücksadresse ein. Alternativ reichen auch Ortsnamen oder Flurstück."
        className="mb-16"
      />
      <EnumeratedCard
        image={mv2}
        imageAltText="Bildbeispiel von Schritt 2 des Grundsteuerdaten-Portals Mecklenburg-Vorpommern"
        number="2"
        heading="Kartenausschnitt"
        text="Der Kartenausschnitt zeigt nun Ihr Grundstück an. Die einzelnen Flächen sind farblich hervorgehoben. Klicken Sie auf Ihr Grundstück in der Karte. "
        className="mb-16"
      />
      <EnumeratedCard
        image={mv3}
        imageAltText="Bildbeispiel von Schritt 3 des Grundsteuerdaten-Portals Mecklenburg-Vorpommern"
        number="3"
        heading="Flurstück auswählen"
        text="Es öffnet sich ein Fenster mit den Details zu Ihrem Grundstück. Klicken Sie auf “Flurstück zur Auswahl hinzufügen”. "
        className="mb-16"
      />
      <EnumeratedCard
        image={mv4}
        imageAltText="Bildbeispiel von Schritt 4 des Grundsteuerdaten-Portals Mecklenburg-Vorpommern"
        number="4"
        heading="PDF abrufen"
        text="Das ausgewähte Flurstück erscheint ganz unten am Seitenrand und kann nun als PDF runtergeladen werden. Klicken Sie auf “Daten als PDF speichern”."
        className="mb-16"
      />
      <EnumeratedCard
        image={mv5}
        imageAltText="Bildbeispiel von Schritt 5 des Grundsteuerdaten-Portals Mecklenburg-Vorpommern"
        number="5"
        heading="PDF öffnen und Bodenrichtwert ablesen"
        text="Öffnen Sie das PDF und lesen Sie den Bodenrichtwert ab. Diesen können Sie auf den Folgeseiten eintragen. Bitte beachten Sie die Hinweise am Ende des PDFs."
        className="mb-16"
      />
    </>
  );
};
