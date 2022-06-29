import EnumeratedCard from "~/components/EnumeratedCard";
import sl1 from "~/assets/images/boris/info-sl-1.png";
import sl2 from "~/assets/images/boris/info-sl-2.png";

export const SLHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={sl1}
          imageAltText="Bildbeispiel von Schritt 1 des Datenstammblatt Saarland"
          number="1"
          heading="Das Datenstammblatt"
          text="Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten. Diesem ist ein Datenstammblatt beigelegt. Darin finden Sie alle Angaben zu Ihrem Grundstück."
          className="mb-16"
        />
        <EnumeratedCard
          image={sl2}
          imageAltText="Bildbeispiel von Schritt 2 des Datenstammblatt Saarland"
          number="2"
          heading="Bodenrichtwert ablesen"
          text="Gehen Sie in die Tabelle des Datenstammblatts. Dort können Sie den Bodenrichtwert in Euro pro Quadratmeter ablesen."
          className="mb-16"
        />
      </div>
    </>
  );
};
