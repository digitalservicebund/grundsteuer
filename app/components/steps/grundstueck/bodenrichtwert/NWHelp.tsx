import EnumeratedCard from "~/components/EnumeratedCard";
import nw1 from "~/assets/images/boris/info-nw-1.png";
import nw2 from "~/assets/images/boris/info-nw-2.png";

export const NWHelp = () => {
  return (
    <>
      <EnumeratedCard
        image={nw1}
        imageAltText="Bildbeispiel von Schritt 1 des Datenstammblatts Nordrhein-Westfalen"
        number="1"
        heading="Das Datenstammblatt"
        text="Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten. Diesem ist ein Datenstammblatt beigelegt. Darin finden Sie alle Angaben zu Ihrem Grundstück."
        className="mb-16"
      />
      <EnumeratedCard
        image={nw2}
        imageAltText="Bildbeispiel von Schritt 2 des Datenstammblatts Nordrhein-Westfalen"
        number="2"
        heading="Bodenrichtwert ablesen"
        text="Gehen Sie in die Tabelle des Datenstammblatts. Dort können Sie den Bodenrichtwert in Euro pro Quadratmeter je Grundstücksfläche ablesen."
        className="mb-16"
      />
    </>
  );
};
