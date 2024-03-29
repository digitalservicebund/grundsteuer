import EnumeratedCard from "~/components/EnumeratedCard";
import be1 from "~/assets/images/boris/info-be-1.png";
import be2 from "~/assets/images/boris/info-be-2.png";
import be3 from "~/assets/images/boris/info-be-3.png";
import be4 from "~/assets/images/boris/info-be-4.png";
import be5 from "~/assets/images/boris/info-be-5.png";

export const BEHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={be1}
          imageAltText="Kartenausschnitt von Schritt 1 Bodenrichtwert-Portal Berlin"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link um auf BORIS Berlin zu gelangen. Geben Sie im linken Bereich Ihre Adresse ein. Versuchen Sie verschiedene Schreibweisen. Meist reichen wenige Buchstaben des Straßennamens und ein Auswahlmenü mit Straßen wird angeboten. Wenn Sie die richtige Adresse gefunden haben bestätigen Sie die Auswahl per Klick auf den Button “Auf Karte anzeigen”."
          className="mb-16"
        />
        <EnumeratedCard
          image={be2}
          imageAltText="Kartenausschnitt von Schritt 2 Bodenrichtwert-Portal Berlin"
          number="2"
          heading="Adresse im Kartenausschnitt finden"
          text="Der Kartenausschnitt zeigt Ihr Grundstück und markiert dieses mit einem blassen, hellblauen Kreis. Der Kreis befindet sich innerhalb eines Bereichs, der durch eine rote gestrichelten Linie umrandet ist. Diese Linien zeigt die Bodenrichtwertgrenze für Ihr Grundstück. Hier können entweder ein oder mehrere Bodenrichtwerte angezeigt werden."
          className="mb-16"
        />
        <EnumeratedCard
          image={be3}
          imageAltText="Kartenausschnitt von Schritt 3 Bodenrichtwert-Portal Berlin"
          number="3"
          heading="Bodenrichtwert auswählen"
          text="Klicken Sie in der oberen Leiste auf das hellgrau hinterlegte “Bodenrichtwert auswählen”. Dann gehen Sie mit dem Mauszeiger auf den hellblauen Markierungskreis im Kartenausschnitt. Der Mauszeiger ist jetzt ein Fadenkreuz. Klicken Sie in den Markierungskreis bzw. auf Ihr gesuchtes Grundstück in der Karte."
          className="mb-16"
        />
        <EnumeratedCard
          image={be4}
          imageAltText="Kartenausschnitt von Schritt 4 Bodenrichtwert-Portal Berlin"
          number="4"
          heading="PDF erzeugen"
          text="Die entsprechende Bodenrichtwertzone sollte jetzt blau schraffiert hervorgehoben sein. Je nach Einsatz und Konfiguration des benutzen Browsers kann diese Darstellung auch ausbleiben. Links in der Ansicht finden Sie jetzt die graue Schaltfläche “PDF erzeugen”. Klicken Sie darauf und ein Dokument öffnet sich."
          className="mb-16"
        />
        <EnumeratedCard
          image={be5}
          imageAltText="Kartenausschnitt von Schritt 5 Bodenrichtwert-Portal Berlin"
          number="5"
          heading="Bodenrichtwert aus PDF entnehmen"
          text="Den Bodenrichtwert entnehmen Sie dem Dokument. Merken Sie sich diesen Wert für die Eingabe.
Wenn Sie zwei Bodenrichtwerte in dem PDF finden, wählen Sie auf der nächsten Seite “zwei Bodenrichtwerte” aus."
          className="mb-16"
        />
      </div>
    </>
  );
};
