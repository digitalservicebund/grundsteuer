import EnumeratedCard from "~/components/EnumeratedCard";
import sh1 from "~/assets/images/boris/info-sh-1.png";
import sh2 from "~/assets/images/boris/info-sh-2.png";
import sh3 from "~/assets/images/boris/info-sh-3.png";
import sh4 from "~/assets/images/boris/info-sh-4.png";

export const SHHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={sh1}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Schleswig-Holstein"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Geben Sie in Suchleiste oben links Ihre Grundstücksadresse ein. "
          className="mb-16"
        />
        <EnumeratedCard
          image={sh2}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Schleswig-Holstein"
          number="2"
          heading="Kartenausschnitt"
          text="Der Kartenausschnitt zeigt nun Ihr Grundstück an. Die roten linien markieren die Grenze des Bodenrichtwert. Wenn Sie den Kartenausschnitt vergrößern, werden auch die Flurstücke in Gelb dargestellt. Klicken Sie auf das rote Symbol, das Ihr Grundstück markiert. "
          className="mb-16"
        />
        <EnumeratedCard
          image={sh3}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Schleswig-Holstein"
          number="3"
          heading="Art der Nutzung auswählen"
          text="Es öffnet sich ein Fenster. Wählen Sie hier die Art der Nutzung aus, die auf Ihr Wohneigentum zutrifft und klicken Sie auf die Zeile. Hinweis: Eigentumswohnungen gehören zu Mehrfamilienhäuser."
          className="mb-16"
        />
        <EnumeratedCard
          image={sh4}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Schleswig-Holstein"
          number="4"
          heading="Bodenrichtwert ablesen"
          text="Den Bodenrichtwert finden Sie in der ersten Zeile der Tabelle. Merken Sie sich den Wert für die Eingabe. Auch Informationen zu Gemarkung, Flur und Flurstück sind später noch relevant."
          className="mb-16"
        />
      </div>
    </>
  );
};
