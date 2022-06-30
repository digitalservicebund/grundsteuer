import EnumeratedCard from "~/components/EnumeratedCard";
import st1 from "~/assets/images/boris/info-st-1.png";
import st2 from "~/assets/images/boris/info-st-2.png";
import st3 from "~/assets/images/boris/info-st-3.png";
import st4 from "~/assets/images/boris/info-st-4.png";
import st5 from "~/assets/images/boris/info-st-5.png";
import st6 from "~/assets/images/boris/info-st-6.png";

export const STHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={st1}
          imageAltText="Kartenausschnitt von Schritt 1 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="1"
          heading="Grundsteuer-Viewer Sachsen-Anhalt öffnen und Adresse eingeben"
          text="Folgen Sie dem Link zum Grundsteuer-Viewer Sachsen-Anhalt. Schließen Sie auf der linken Seite den Bereich für die Suchparameter mit einem Klick auf das graue X in der rechten oberen Ecke."
          className="mb-16"
        />
        <EnumeratedCard
          image={st2}
          imageAltText="Kartenausschnitt von Schritt 2 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="2"
          heading="Adresse eingeben"
          text="Darunter befindet sich eine Suchleiste. Geben Sie hier die Adresse Ihres Grundstücks ein und bestätigen Sie die Auswahl."
          className="mb-16"
        />
        <EnumeratedCard
          image={st3}
          imageAltText="Kartenausschnitt von Schritt 3 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="3"
          heading="Flurstück im Kartenausschnitt finden"
          text="Die eingegebene Adresse wird mit einem roten Symbol markiert. Mit Klick auf das Plus-Zeichen am rechten Kartenrand vergrößern Sie den Ausschnitt und sehen weitere Details zu Flurstück und Gemarkung."
          className="mb-16"
        />
        <EnumeratedCard
          image={st4}
          imageAltText="Kartenausschnitt von Schritt 4 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="4"
          heading="Gemarkung und Flur ermitteln"
          text="Verschieben Sie den Kartenausschnitt so, das Gemarkung (“Gmkg”) und Flur innerhalb der roten Linie angezeigt werden."
          className="mb-16"
        />
        <EnumeratedCard
          image={st5}
          imageAltText="Kartenausschnitt von Schritt 5 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="5"
          heading="Informationen zum Flurstück erhalten"
          text="Klicken Sie auf “Suche” oben in der Menüleiste. Das Suchfenster öffnet sich im linken Bereich. Übertragen Sie hier die Angaben aus dem Kartenausschnitt zu Gemarkung, Flur, Zähler und Nenner. Klicken Sie auf “Suche starten”"
          className="mb-16"
        />
        <EnumeratedCard
          image={st6}
          imageAltText="Kartenausschnitt von Schritt 6 des Grundsteuer-Viewer Sachsen-Anhalt"
          number="6"
          heading="Bodenrichtwert ablesen"
          text="Rechts öffnet sich ein Fenster “Informationen zum Flurstück”. Scrollen Sie in diesem Fenster runter bis Sie die Angaben zum Bodenrichtwert finden. Merken Sie sich diesen für die Eingabe. Laden Sie sich bei Bedarf auch das Infoblatt als PDF herunter."
          className="mb-16"
        />
      </div>
    </>
  );
};
